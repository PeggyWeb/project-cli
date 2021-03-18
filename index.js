const { prompt } = require('enquirer')
const download = require('download-git-repo')
const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const { TEMPLATESLINK } = require('./config/template')
const {
	cyan,
	green,
	yellow,
	magenta,
	lightRed,
	stripColors,
} = require('kolorist')
const { copy, copyDir, emptyDir, wrirte } = require('./util/util')

const TEMPLATES = [
	yellow('vanilla'),
	green('vue'),
	green('nuxt'),
	cyan('react'),
	cyan('next'),
	magenta('preact'),
	magenta('preact-ts'),
	lightRed('lit-element'),
	lightRed('lit-element-ts'),
]

const cwd = process.cwd()
let targetDir = argv._[0]
let root
let template = argv.t || argv.template
async function isProjectName() {
	if (!targetDir) {
		const { name } = await prompt({
			type: 'input',
			name: 'name',
			massage: 'What is you project name?',
			initial: 'tuju-project',
		})
		targetDir = name
	}
	console.log(cwd, targetDir)
	root = path.join(cwd, targetDir)

	if (!fs.existsSync(root)) {
		fs.mkdirSync(root, { recursive: true })
	}
}

async function isEmpty() {
	console.log(root)
	const existing = fs.readdirSync(root)
	if (existing.length) {
		const { yes } = await prompt({
			type: 'confirm',
			name: 'yes',
			initial: 'y',
			message:
				`Target directory ${targetDir} is no empty.\n` +
				'Remove existing files and continue',
		})
		if (yes) {
			emptyDir(root)
		} else {
			return
		}
	}
}
async function isTemplate() {
	if (!template) {
		const { name } = await prompt({
			type: 'select',
			name: 'name',
			// initial: 'react',
			message: 'select a templace',
			choices: TEMPLATES,
		})
		template = stripColors(name)
	}
}

async function main() {
	await isProjectName()
	await isEmpty()
	await isTemplate()
}

// 选择模板
// 如果在当前的这个目录下有一些已经写好的模板的话
// const templateDir = path.join(__dirname, `template-${template}`)
// const files = fs.readdirSync(templateDir)
// for (const file of files.filter((f) => f !== 'package.json')) {
// 	write(file)
// }
// function rewritePackName() {
// 	const pkg = require(path.join(templateDir, `package.json`))
// 	pkg.name = path.basename(root)
// 	write('package.json', JSON.stringify(pkg, null, 2))
// }

// 项目模板的地址

main().then(() => {
	console.log(root)
	download(TEMPLATESLINK.get(template), 'test/tmp', function (err) {
		console.log(err ? 'Error' : 'Success')
		console.log(err)
		console.log(`\nDone. Now run:\n`)
		if (root !== cwd) {
			console.log(`  cd ${path.relative(cwd, root)}`)
		}
		console.log(`  npm install (or \`yarn\`)`)
		console.log(`  npm run dev (or \`yarn dev\`)`)
	})
})
