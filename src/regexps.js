export const url = {
    source: '[a-zA-z]+:\\/\\/[^\\s]*',
    flags: 'gi',
    input: 'https://github.com/cnlon/regexp.online\nzhangsan@gmail.com\n32132119990909123x\n200000\n192.168.0.1',
    title: '网址'
}

export const email = {
    source: '[a-z0-9]+[_a-z0-9\\.-]*[a-z0-9]+@[a-z0-9-]+(?:\\.[a-z0-9-]+)*(?:\\.[a-z]{2,4})',
    flags: 'gi',
    input: 'https://github.com/cnlon/regexp.online\nzhangsan@gmail.com\n32132119990909123x\n200000\n192.168.0.1',
    title: '邮箱'
}

export const idcard = {
    source: '^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$',
    flags: 'gim',
    input: 'https://github.com/cnlon/regexp.online\nzhangsan@gmail.com\n32132119990909123x\n200000\n192.168.0.1',
    title: '身份证'
}

export const postcode = {
    source: '^[1-9][0-9]{5}$',
    flags: 'gm',
    input: 'https://github.com/cnlon/regexp.online\nzhangsan@gmail.com\n32132119990909123x\n200000\n192.168.0.1',
    title: '邮编'
}

export const ip = {
    source: '(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)',
    flags: 'g',
    input: 'https://github.com/cnlon/regexp.online\nzhangsan@gmail.com\n32132119990909123x\n200000\n192.168.0.1',
    title: 'IP'
}
