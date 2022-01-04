const actions = {
  addAsync(context) {
    setTimeout(() => {
      context.commit('add2')
    }, 1000)
  }
}
export {actions}