class ColorPicker {
  constructor() {
    this.selectedColor = ''
    this.swatches = document.querySelector('#swatchesContainer')
  }

  createColorPalette() {
    this.swatches.addEventListener('click', (ev) => {
      if (ev.target.id !== 'swatchesContainer') {
        const current = this.swatches.querySelector('.selected')
        current.classList.remove('selected')
        ev.target.classList.add('selected')
        this.selectedColor = ev.target.getAttribute('data-hex')
      }
    })

    const hexValues = ['00', '33', '66', '99', 'CC', 'FF']
    const colors = []

    hexValues.forEach( red => {
      hexValues.forEach( green => {
        hexValues.forEach( blue => {
          colors.push(`${red}${green}${blue}`)
        })
      })
    })

    const html = colors.map( color => {
      return `
        <div class='swatch' data-hex='${color}' style='background-color:#${color}'>
        </div>
      `;
    }).join('')

    this.swatches.innerHTML = html;
    this.swatches.children[0].classList.add('selected')
    this.selectedColor = this.swatches.children[0].getAttribute('data-hex')
  }
}

export {ColorPicker}
