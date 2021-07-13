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

  Swal.fire({
    ...defaultOptions,
    ...opt
  })
}

export { fireToast }
