const fs = require('fs')
const path = require('path')
module.export = function emptyDir(dir) {
	if (!fs.existsSync(dir)) {
		return
	}
	for (const file of fs.readdirSync(dir)) {
		const abs = path.resolve(dir, file)
		if (fs.lstatSync(abs).isDirectory) {
			emptyDir(abs)
			fs.rmdirSync(abs)
		} else {
			fs.unlinkSync(abs)
		}
	}
}

module.export = function copy(src, dest) {
	const stat = fs.statSync(src)
	if (stat.isDirectory()) {
		copyDir(src, dest)
	} else {
		fs.copyFileSync(src, dest)
	}
}

module.export = function copyDir(srcDir, destDir) {
	fs.mkdirSync(destDir, { recursive: true })
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file)
		const destFile = path.resolve(destDir, file)
		copy(srcFile, destFile)
	}
}

module.export = function write(file, content) {
	const targetPath = renameFiles[file]
		? path.join(root, renameFiles[file])
		: path.join(root, file)
	if (content) {
		fs.writeFileSync(targetPath, content)
	} else {
		copy(path.join(templateDir, file), targetPath)
	}
}
