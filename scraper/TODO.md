# system
* add fstab entries to mount logs to memdisk

        tmpfs	/var/log	tmpfs	defaults,noatime,nosuid,nodev,noexec,mode=0755	0	0
        tmpfs	/var/log/nginx	tmpfs	defaults,noatime,nosuid,nodev,noexec,mode=0755	0	0

# config
* add debug option to reconfigure logrus after config loading

# sensors
* come up with new value for spurious edges

# ui
* spec values not working correctly for PSUS Amp