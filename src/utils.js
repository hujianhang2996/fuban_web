export function sizeFormatter(size, format_type) {
    let format_params = {
        speed: { danweis: ['B/s', 'KB/s', 'MB/s', 'GB/s'], max_danwei: 3 },
        size: { danweis: ['B', 'K', 'M', 'G', 'T'], max_danwei: 4 }
    }
    var f_size = size
    var danwei = 0
    while (f_size > 1024 && danwei < format_params[format_type].max_danwei) {
        f_size /= 1024
        danwei += 1
    }
    return f_size.toFixed(1) + format_params[format_type].danweis[danwei]
}