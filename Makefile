GIT_COMMIT := $(shell git describe --tags | tr -d v)
GIT_DIRTY := $(if $(shell git status --porcelain),~$(shell git rev-parse --short HEAD))
VERSION := $(GIT_COMMIT)$(GIT_DIRTY)
DEBEMAIL="debian@fournier.nl"
DEBFULLNAME="Wim Fournier"

build-deps:
	sudo apt update
	sudo apt install -y moreutils git-buildpackage build-essential

react-web/build:
	cd react-web; \
	yarn install; \
	yarn build

build/DEBIAN/changelog:
	cd build; \
	echo >DEBIAN/changelog; \
	prevtag=initial; \
	pkgname=`cat DEBIAN/control | grep '^Package: ' | sed 's/^Package: //'`; \
	git tag -l v* | sort -V | while read tag; do \
	(echo "$$pkgname ($${tag#v}) unstable; urgency=low\n"; git log --pretty=format:'  * %s' $$prevtag..$$tag; \
	  git log --pretty='format:%n%n -- %aN <%aE>  %aD%n%n' $$tag^..$$tag) | cat - DEBIAN/changelog | sponge DEBIAN/changelog; \
	prevtag=$$tag; \
	done; \
	tag=`git tag -l v* | sort -V | tail -1`; \
	[ `git log --exit-code $$tag..HEAD | wc -l` -ne 0 ] && gbp dch -s $$tag -S --no-multimaint --nmu --ignore-branch \
	  --snapshot-number="'{:%Y%m%d%H%M%S}'.format(__import__('datetime').datetime.fromtimestamp(`git log -1 --pretty=format:%at`))"; \
	sed -i 's/UNRELEASED/unstable/' DEBIAN/changelog

scraper/scraper:
	cd scraper; make

prepare-package: scraper/scraper react-web/build build/DEBIAN
	mkdir -p build/opt/repeater-sensors
	cp -r snmp-passthrough.py README.md requirements.txt scraper/scraper scraper/config.yaml build/opt/repeater-sensors/
	cp -r react-web/build build/opt/repeater-sensors/web
	sed -e "s/Version:.*/Version: $(VERSION)/" -i build/DEBIAN/control

build-package: prepare-package
	find build
	cd build; dpkg-deb -b . ../repeater-sensors-$(VERSION).deb
	cp repeater-sensors-$(VERSION).deb repeater-sensors.deb

clean:
	rm -r build/DEBIAN/changelog build/opt react-web/build