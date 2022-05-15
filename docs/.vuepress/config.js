module.exports = {
    base: '/',
    title: '小米粥的笔记',
    description: ' ',
    head: [
        ['link', {rel: 'icon', href: '/img/index/logo.png'}]
    ],
    themeConfig: {
        logo: '/img/index/logo.png',
        // 编辑文档的所在目录
        docsDir: 'docs',
        // 文档放在一个特定的分支下：
        docsBranch: 'master',
        locales: {
            "/": {
                nav: [
                    // {
                    //     text: '导读',
                    //     link: '/md/guide-to-reading.md'
                    // },
                    // {
                    //     text: 'Java',
                    //     items: [
                    //         {
                    //             text: 'Java反射',
                    //             link: '/md/Java/Java反射.md'
                    //         }
                    //     ]
                    // }
                ]
            }
        },
        sidebar: {
            "/md/": genBarOther(),
            "/md/Java/": genBarJavaDocs()
        }
    }
};

function genBarOther() {
    return [
        {
            title: "阅读指南",
            collapsable: false,
            sidebarDepth: 2,
            children: [
                "guide-to-reading.md"
            ]
        }
    ]
}

function genBarJavaDocs() {
    return [
        {
            title: "Java",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java反射.md"
            ]
        }
    ]
}