#!/usr/bin/env node


const commander = require('commander')
const pkg = require('../package.json')
// 实例化一个Command示例
const program = new commander.Command();

program
  .name(Object.keys(pkg.bin)[0])
  .usage('<command> [options]')
  .version(pkg.version)
  .option('-d, --debug', '是否开启调试模式', false)
  .option('-e, --envName <envName>', '获取环境变量名称')



// command 注册命令

/**
 * source <>必选操作
 * destination  []可选操作
 * */
const clone = program.command('clone <source> [destination]')
clone
  .description('clone a repository')   // jun-cli-test clone -h 可以打印描述
  .option('-f, --force', '是否强制克隆')
  .action((source, destination, cmdObj)=> {
    console.log(source,destination, cmdObj.force)
  })

// addCommand 注册子命令
const  service = new commander.Command('service')
service
  .command('start [port]')
  .description('start service at some port')
  .action((port)=> {
    console.log('do service start', port)
  })
service
  .command('stop')
  .description('stop service')
  .action(() => {
    console.log('stop service');
  });
program.addCommand(service);

// 高级用法 监听输入的所有方法
// program
//   .arguments('<cmd> [options]')
//   .description('test command', {
//     cmd: 'command to run',
//     options: 'options for command',
//   })
//   .action(function(cmd, options) {
//     console.log(cmd, options);
//   });

// 现用写法 jun-cli-test install init   相当于执行 imooc-cli init
program
  .command('install [name]', 'install package',{ // 根据输入的命令拼接 install 【name】 组成新命令 用于不同脚手架串联使用
    executableFile: 'imooc-cli', // 输入的命令 重命名为init-install
    isDefault: false,  // true 默认执行此命令
    hidden: true // 隐藏命令提示
  })
  .alias('i') // 简化命令


// 高级定制1：自定义help信息
// program.helpInformation = function () {
//   return 'your help infomation'
// }
// program.on('--help', function (){
//   console.log('hahah')
// })

// 高级定制2：实现debug模式
const options = program.opts();
program.on('option:debug', function () {
  // console.log('debug', options.debug)

  if(options.debug) {
    process.env.LOG_LEVEL = 'verbose'
  }
  console.log(process.env.LOG_LEVEL)
})

// 高级定制3：对未知命令监听
program.on('command:*', function (obj) {
  // console.log(obj)
  // console.log(program.commands[0].name())
  const availableCommands = program.commands.map(cmd=>cmd.name()) // 获取可用命令
  console.log(availableCommands)
  console.log('可用命令：'+availableCommands.join(','))
})


program.parse(process.argv);