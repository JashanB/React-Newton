const updateUserEmail = function() {
  const $updateEmail = $('#update-email');
  $updateEmail.submit(function() {
    //line here to check that email is not empty before you send the POST
    event.preventDefault();
    console.log($updateEmail.serialize());
    $.post('/profile/email', $updateEmail.serialize(), data => {
      if (data.error) {
        alert(data.error)
      }
      else {
        alert(`Thanks! Your email has been updated to ${data.email}`)
      }
    })
  })
}


$(document).ready(function() {
  updateUserEmail();
});


