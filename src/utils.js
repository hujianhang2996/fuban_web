let format_params = {
    speed: { danweis: ['B/s', 'KB/s', 'MB/s', 'GB/s'], max_danwei: 3 },
    size: { danweis: ['B', 'K', 'M', 'G', 'T'], max_danwei: 4 }
}

export function sizeFormatter(size, format_type, is_b = false) {
    if (size < 0) return '--'
    var f_size = size
    if (is_b) f_size /= 8
    var danwei = 0
    while (f_size > 1024 && danwei < format_params[format_type].max_danwei) {
        f_size /= 1024
        danwei += 1
    }
    return f_size.toFixed(1) + format_params[format_type].danweis[danwei]
}