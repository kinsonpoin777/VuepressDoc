module.exports = {
  title: 'OPEN API Doc',
  description: '接口说明文档',
  devServer: {
    host: '10.71.88.135',
    port: '8000'
  },
  head: [
    ['link', { rel: 'icon', href: '/bitbug_favicon.ico' }], 
  ],
  base: '/', 
  markdown: {
    lineNumbers: true 
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@img': '../docs/.vuepress/public',
		'@pic': '../../docs/.vuepress/public'
      }
    }
  },
  themeConfig: {
    searchMaxSuggestions: 10,
	  displayAllHeaders: false,
    sidebarDepth: 2, 
    smoothScroll: true,
	  sidebar: {
		'/': [
		    ['Guide','接入指南'],
			['IOT','IOT通讯协议'],
			['Application_of_API','应用API'],
			['Video_service','视频服务'],
		{
			title: '数字空间', // 侧边栏名称
			collapsable: true, // 可折叠
            children: [
                ['/data_space/Basic_document','数字空间基础能力接口文档'],
                ['/data_space/Metro_documents','业务场景接口文档--地铁场景'],
				['/data_space/Data_guide','数字空间数据上报及实时数据获取指南-建筑类']//你的md文件地址
            ]
		},
        'Error_code',
        'appendix'
    ],
	}
  }
}