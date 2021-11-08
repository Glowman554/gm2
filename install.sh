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
	printf "[\033[32mOK\033[0m]\n"
}

build_application gm2
install_application gm2

run_cleanup