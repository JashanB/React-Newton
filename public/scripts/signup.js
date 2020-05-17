$(document).ready(function() {

  const $signUp = $("#sign-up")
  $signUp.submit(function() {
    event.preventDefault();
    const topic1 = $( "select#topic-select-1" ).val();
    const topic2 = $( "select#topic-select-2" ).val();
    const topic3 = $( "select#topic-select-3" ).val();
    const emailLength = $("input[name='email']").val().length;
    if (emailLength === 0) {
      alert('Please input a valid email.')
    } else if (!topic1 || !topic2 || !topic3) {
      alert('Please choose 3 topics of interest to begin!')
    } else {
      $.post('/signup', $signUp.serialize(), data => {
        if (data.error) {
          alert('Sorry that email appears to already be in use, please choose another.')
        } else {
          window.location.href ="http://localhost:8080/" + data.user_id;
        }

      });
    }
  })
});
