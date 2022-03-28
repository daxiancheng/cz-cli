#!/usr/bin/env node
const inquirer = require('inquirer');    // 用于与命令行交互
const path = require('path')
const fs = require('fs')
const ejs = require('ejs');              // 用于解析 ejs 模板
const child_process = require('child_process')
const chalk = require("chalk")
const ora = require("ora")
const shell = require("shelljs")
const download = require("download-git-repo")
const program = require('commander')
// const { Transform } = require('stream'); // 用于流式传输
// const { spawn } = require('child_process');
program.version(chalk.green('♫ ===== Chengzi，cz-cli ===== \n  version: 1.0.0'), '-v, --version').
command('init <name>').
action((name)=>{
  if(!fs.existsSync(name)) {
    inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: '请输入项目描述?'
      },
      {
        type: 'input',
        name: 'author',
        message: '请输入作者名称?'
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入版本号?',
        default: '1.0.0'
      }
    ]).then(answers => {
        console.log(answers)
        //ora、chalk模块也进行了一些视觉美化
        const spinner = ora('正在下载...\n');
        spinner.start();
        const description = answers.description;
        const author = answers.author;
        const version = answers.version;
        // const tempPath = path.join(__dirname, './template/public/index.html');      // 获取模板文件的路径
        // const filePath = path.join('./',fileName + '.html');   // 创建新文件的路径
        // const read = fs.createReadStream(tempPath);                  // 读取模板文件中的内容
        // const write = fs.createWriteStream(filePath);                // 创建新文件
        // const transformStream = new Transform({
        //     transform: (chunk, encoding, callback) => {
        //     const input = chunk.toString();               // 模板内容
        //     const output = ejs.render(input, { title });  // 解析模板
        //     callback(null, output);
        //   }
        // })
        // read.pipe(transformStream).pipe(write)
        // download('direct:https://tse1-mm.cn.bing.net/th/id/R-C.4d9cd2e53dddfc238a06e750b73cd023?rik=MsMCKPGumufOyQ&riu=http%3a%2f%2fwww.desktx.com%2fd%2ffile%2fwallpaper%2fscenery%2f20170209%2fc2accfe637f86fb6f11949cb8651a09b.jpg&ehk=ia2TVXcow6ygWUVZ1yod5xH4aGd8565SYn6CRpxkNoo%3d&risl=&pid=ImgRaw&r=0',fileName, (err)=>{
        //   if(err){
        //     spinner.fail('文件下载失败\n',err);
        //   } else {
        //     const filePathArr = fs.readdirSync(fileName)
        //     console.log('fileName',filePathArr)
        //     spinner.succeed('♫♫♫ 下载成功 ♫♫♫');
        //     for(let i = 0; i<filePathArr.length;i++){
        //       fs.renameSync(fileName+'/'+filePathArr[i], fileName+'/xx.jpg')
        //     }
        //   }
        // })
  
        // https://github.com/daxiancheng/template-color.git
        download("daxiancheng/template-color", name, (err)=>{
          if (err) {
            spinner.fail();
            console.log(chalk.red('模板下载失败了 (*>﹏<*)′\n',err))
          } else {
            spinner.succeed('ƪ(˘⌣˘)ʃ 下载成功 ƪ(˘⌣˘)ʃ');

            // 处理index.heml
            const indexPath = name + '/public/index.html'
            if (fs.existsSync(indexPath)) {
              ejs.renderFile(indexPath, {
                title: name
              },(err, data)=>{
                if (err) {
                  console.log(chalk.red('初始化index.html失败 (*>﹏<*)′\n'), err)
                } else {
                  fs.writeFile(indexPath, data,(err)=>{
                    if(err) {
                      console.log(chalk.red('初始化index.html失败 (*>﹏<*)′\n'), err)
                    }
                  })  
                }
              })
            } else {
              console.log(chalk.red('初始化index.html失败 (*>﹏<*)′\n'), err)
            }

            // 处理package.json
            const pgPath = name + '/package.json'
            if (fs.existsSync(pgPath)) {
              const content = fs.readFileSync(pgPath).toString()
              const data = JSON.parse(content)
              data.description = description
              data.author = author
              data.version = version
              fs.writeFile(pgPath, JSON.stringify(data, null, '\t'), 'utf-8',(err)=>{
                if(err){
                  console.log(chalk.red('初始化package.json失败 (*>﹏<*)′\n'), err)
                } else {
                  console.log(chalk.green(`ƪ(˘⌣˘)ʃ 初始化完成 ƪ(˘⌣˘)ʃ\n 请运行:\n cd ${name}\n npm install\n npm run serve`))
                }
              })
            } else {
              console.log(chalk.red('package.json获取失败 (*>﹏<*)′\n'), err)
            }
          }
        })
      })
  } else {
    console.log(chalk.red(`${name} 项目已存在`))
  }
  
})
program.parse(process.argv);