var width = 500
var height = 500
var scale = 1
var spread = 1
// var grid = [...Array(height)].map(e => Array(width).fill(null))
var temp_arr;
var arr = new Uint8ClampedArray(width*height*4)
var cols = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
var darkFrame = 0

for (let i=0; i<width*height*2; i+=4) {
    arr[i] = 0
    arr[i+1] = 0
    arr[i+2] = 0
    arr[i+3] = 255
}
for (let i=width*height*2; i<width*height*4; i+=4) {
    arr[i] = 255
    arr[i+1] = 255
    arr[i+2] = 255
    arr[i+3] = 255
}

function draw() {
    let imageData = new ImageData(arr, width, height)
    ctx.putImageData(imageData, 0, 0)
}

function copyArrayToTemp() {
    temp_arr = Uint8ClampedArray.from(arr)
}

function copyTempToArray() {
    arr = temp_arr
}

function getCell(x, y) {
    return arr[(y*width + x)*4]
}

function setCell(x, y, val) {
    let i = (y*width + x)*4
    temp_arr[i] = val
    temp_arr[i + 1] = val
    temp_arr[i + 2] = val
    temp_arr[i + 3] = 255
}

function update() {
    copyArrayToTemp()
    for (let y=0; y<height; y++) {
        for (let x=0; x<width; x++) {
            
            let blackCells = 0
            let whiteCells = 0 // TODO: fix edges
            for (let dy=-spread; dy<=spread; dy++) {
                for (let dx=-spread; dx<=spread; dx++) {
                    if (!(dx === 0 && dy === 0)) {
                        nx = x + dx
                        ny = y + dy
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            let col = getCell(nx, ny)
                            if (col === 0) {
                                blackCells++
                            } else if (col === 255) {
                                whiteCells++
                            }
                        }
                    }
                }
            }
            currentColour = getCell(x, y)
            if (!(currentColour === 255 && blackCells === 0) && !(currentColour === 0 && whiteCells === 0)) {
                newColour = (Math.random() < blackCells/(blackCells+whiteCells)) ? 0 : 255
                setCell(x, y, newColour)
            }            
        }
    }
    copyTempToArray()
}

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
canvas.width = width*scale
canvas.height = height*scale

function main() {
    update()
    draw()
    
    // setTimeout(main, 500)
    requestAnimationFrame(main)
}

main()