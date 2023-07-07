package com.x.program.init;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

import org.apache.commons.lang3.BooleanUtils;

import com.x.base.core.project.config.Config;
import com.x.base.core.project.tools.ZipTools;
import com.x.program.init.Missions.Mission;

public class MissionRestore implements Mission {

	private String stamp;

	public String getStamp() {
		return stamp;
	}

	public void setStamp(String stamp) {
		this.stamp = stamp;
	}

	@Override
	public void execute(Missions.Messages messages) {
		messages.head(MissionRestore.class.getSimpleName());
		try {
			messages.msg("executing");
			Path path = Config.path_local_temp(true).resolve(getStamp() + ".zip");
			if (!ZipTools.isZipFile(path)) {
				throw new ExceptionMissionExecute("file is not zip file format.");
			}
			ZipTools.unZip(path.toFile(), null, Config.path_local_dump(true).resolve("dumpData_" + getStamp()).toFile(),
					true, StandardCharsets.UTF_8);
			if ((null == Config.externalDataSources().enable())
					|| BooleanUtils.isNotTrue(Config.externalDataSources().enable())) {
				Config.resource_commandQueue().add("start dataSkipInit");
				Thread.sleep(2000);
				Config.resource_commandQueue().add("ctl -initResourceFactory");
				Thread.sleep(2000);
			}
			if ((null == Config.externalStorageSources())
					|| BooleanUtils.isNotTrue(Config.externalStorageSources().getEnable())) {
				Config.resource_commandQueue().add("start storageSkipInit");
				Thread.sleep(2000);
			}
			Config.resource_commandQueue().add("ctl -rd " + getStamp());
			Config.resource_commandTerminatedSignal_ctl_rd().take();// 等待执行完成信号.
			messages.msg("success");
		} catch (InterruptedException ie) {
			Thread.currentThread().interrupt();
			messages.err(ie.getMessage());
			throw new ExceptionMissionExecute(ie);
		} catch (Exception e) {
			messages.err(e.getMessage());
			throw new ExceptionMissionExecute(e);
		}
	}

}