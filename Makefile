GIT_COMMIT := $(shell git describe --tags)
GIT_DIRTY := $(if $(shell git status --porcelain),~$(shell git rev-parse --short HEAD))
VERSION := $(GIT_COMMIT)$(GIT_DIRTY)
DEBEMAIL="debian@fournier.nl"
DEBFULLNAME="Wim Fournier"

build-deps:
	apt update
	apt install -y moreutils git-buildpackage build-essential

react-web/build:
	cd react-web; \
	yarn install; \
	yarn build

build/debian/changelog:
	cd build; \
	echo >debian/changelog; \
	prevtag=initial; \
	pkgname=`cat debian/control | grep '^Package: ' | sed 's/^Package: //'`; \
	git tag -l v* | sort -V | while read tag; do \
	(echo "$$pkgname ($${tag#v}) unstable; urgency=low\n"; git log --pretty=format:'  * %s' $$prevtag..$$tag; \
	  git log --pretty='format:%n%n -- %aN <%aE>  %aD%n%n' $$tag^..$$tag) | cat - debian/changelog | sponge debian/changelog; \
	prevtag=$$tag; \
	done; \
	tag=`git tag -l v* | sort -V | tail -1`; \
	[ `git log --exit-code $$tag..HEAD | wc -l` -ne 0 ] && git-dch -s $$tag -S --no-multimaint --nmu --ignore-branch \
	  --snapshot-number="'{:%Y%m%d%H%M%S}'.format(__import__('datetime').datetime.fromtimestamp(`git log -1 --pretty=format:%at`))"; \
	sed -i 's/UNRELEASED/unstable/' debian/changelog

prepare-package: react-web/build build/debian/changelog
	mkdir -p build/opt/repeater-sensors
	cp -r sensors *.py README.md build/opt/repeater-sensors/
	cp -r react-web/build build/opt/repeater-sensors/web
	sed -e "s/Version:.*/Version: $(VERSION)/" -i build/debian/control

build-package: prepare-package
	cd build; dpkg-deb -b . ../repeater-sensors-$(VERSION).deb
	cp repeater-sensors-$(VERSION).deb repeater-sensors.deb

clean:
	rm -r build/debian/changelog build/opt react-web/build