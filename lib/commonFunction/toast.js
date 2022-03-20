import Swal from 'sweetalert2'

const fireToast = opt => {
  const defaultOptions = {
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  }

  const Toast = Swal.mixin({
    ...defaultOptions
  })

  Toast.fire({
    ...opt
  })
}

export { fireToast }
