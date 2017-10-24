let socket = io.connect('http://localhost:8080', { 'forceNew': true });

function sendName(e) {
  const username = document.getElementById('username').value;
  socket.emit('hello', username);
  return false;
}

socket.on('hello', (data) => {
  console.log(data);
})

socket.on('waiting', (data) => {
  console.log(data);
})

socket.on('play', (data) => {
  console.log(data.message);
  console.log(data.questions);
})





function bind(){
  var navListItems = $('div.setup-panel div a'),
          allWells = $('.setup-content'),
          allNextBtn = $('.nextBtn');

  $('#steps').fadeIn();
  allWells.hide();

  navListItems.click(function (e) {
      e.preventDefault();
      var $target = $($(this).attr('href')),
              $item = $(this);

      if (!$item.hasClass('disabled')) {
          navListItems.removeClass('btn-primary').addClass('btn-default');
          $item.addClass('btn-primary');
          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();
      }
  });
}
