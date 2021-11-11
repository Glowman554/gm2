function build_application {
	#printf "Building application component $1...  "
	printf "[\033[31m**\033[0m] Building application component $1...\r"
	mkdir -p bin &> /dev/null || (printf "\nFailed to create bin/\n $1\n" && exit 1)
	deno bundle --unstable $1.js bin/$1.bundle.js &> /tmp/$1_bunle.log || (printf "\nFailed to build $1\n" && exit 1)
	deno compile --unstable -A bin/$1.bundle.js &> /tmp/$1_compile.log || (printf "\nFailed to compile $1\n" && exit 1)
	mv $1.bundle bin/$1 &> /dev/null || (printf "\nFailed to move $1.bundle\n" && exit 1)
	printf "[\033[32mOK\033[0m]\n"
}

function install_application {
	printf "[\033[31m**\033[0m] Installing application component $1...\r"
	sudo cp bin/$1 /bin/$1 &> /dev/null || (printf "\nFailed to copy $1\n" && exit 1)
	printf "[\033[32mOK\033[0m]\n"
}

function run_cleanup {
	printf "[\033[31m**\033[0m] Cleaning up...\r"
	rm -rf bin/ &> /dev/null || (printf "\nFailed to remove bin/\n" && exit 1)
	rm -rf $HOME/.gm2-src &> /dev/null || (printf "\nFailed to remove $HOME/.gm2-src/\n" && exit 1)
	printf "[\033[32mOK\033[0m]\n"
}

function get_deno {
	deno -V &> /dev/null
	if [ $? -eq 0 ]
	then
    		printf "[\033[32m--\033[0m] Installing deno...\n"
    	else
		printf "[\033[31m**\033[0m] Installing deno...\r"
		(curl -fsSL https://deno.land/x/install/install.sh | sh) &> /tmp/deno.log || (printf "\nFailed to install deno\n" && exit 1)
		printf "[\033[32mOK\033[0m]\n"

		local deno_install="${DENO_INSTALL:-$HOME/.deno}"
	
		export DENO_INSTALL="$deno_install"
		export PATH="$DENO_INSTALL/bin:$PATH"
	fi
}

function setup_repo {
	printf "[\033[31m**\033[0m] Cloning repo...\r"
	git clone https://github.com/Glowman554/gm2.git $HOME/.gm2-src &> /dev/null || (printf "\nFailed to clone repo\n" && exit 1)
	cd $HOME/.gm2-src
	printf "[\033[32mOK\033[0m]\n"
}

get_deno

setup_repo

build_application gm2
install_application gm2

run_cleanup
