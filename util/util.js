const fs = require('fs')
const path = require('path')
const emptyDir = function (dir) {
	console.log(dir)
	try {
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
	} catch (err) {
		console.log(err)
		throw err
	}
}
const copy = function (src, dest) {
	const stat = fs.statSync(src)
	if (stat.isDirectory()) {
		copyDir(src, dest)
	} else {
		fs.copyFileSync(src, dest)
	}
}
const copyDir = function (srcDir, destDir) {
	fs.mkdirSync(destDir, { recursive: true })
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file)
		const destFile = path.resolve(destDir, file)
		copy(srcFile, destFile)
	}
}
const write = function (file, content) {
	const targetPath = renameFiles[file]
		? path.join(root, renameFiles[file])
		: path.join(root, file)
	if (content) {
		fs.writeFileSync(targetPath, content)
	} else {
		copy(path.join(templateDir, file), targetPath)
	}
}

module.exports.emptyDir = emptyDir
module.exports.copy = copy
module.exports.copyDir = copyDir
module.exports.write = write
