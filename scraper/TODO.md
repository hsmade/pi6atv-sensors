# system
* add fstab entries to mount logs to memdisk

        tmpfs	/var/log	tmpfs	defaults,noatime,nosuid,nodev,noexec,mode=0755	0	0
        tmpfs	/var/log/nginx	tmpfs	defaults,noatime,nosuid,nodev,noexec,mode=0755	0	0

# config
* add debug option to reconfigure logrus after config loading

# sensors
* come up with new value for spurious edges
* rename 60o to 55o
* change max spec for flow to 1

# ui
* fix width of Watt in PSU table