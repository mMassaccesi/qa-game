let socket = io.connect('http://localhost:8080', { 'forceNew': true });
let correctCount = 0;
let index = 1; //Room's user array
let name;
let oponentCorrects = -1;
let finished = false;

function sendName(e) {
  name = document.getElementById('username').value;
  socket.emit('hello', name);
  return false;
}

socket.on('hello', (data) => {
  // $('.message').text(data);
})

socket.on('waiting', (data) => {
  $('.message').fadeIn().text(data.message);
  index = 0; //First item because its creating the room
})

socket.on('play', (data) => {
  counting();
  prepareLayout(JSON.parse(data.questions), data.users);
})

socket.on('results', (data) => {
  oponentCorrects = data;
  if(finished)
    showResults();
})

// Show usernames and display questions
function prepareLayout(questions, users){
  $('.message').fadeIn().text(users[0].name + ' vs ' + users[1].name);

  questions.forEach((q, i) => {
    let options = '';

    // Create options for each question
    q.options.forEach((o, oi) => {
      let isCorrect = o == q.answer;
      options += `<div class="alert q-option" data-parent="question-${i}" style="border: solid 1px #ccc" data-correct="${isCorrect}">${o}</div>`;
    })

    let link = `<a href="#question-${i+1}" type="button" class="btn btn-default" style="display:none">Siguiente pregunta</a>`;
    if(i+1 == questions.length)
      link = `<a href="#results" type="button" class="btn btn-default" style="display:none">Finalizar</a>`;

    let layout = {
      button: `<div class="stepwizard-step">
                <a type="button" class="btn btn-primary btn-circle">${i+1}</a>
                <p>Pregunta ${i+1}</p>
              </div>`,
      step: `
              <div class="row setup-content" id="question-${i}">
                <div class="col-xs-6">
                  <div class="col-md-12">
                    <h3>${q.question}</h3>
                    <p><strong>Categoria:</strong> ${q.category}</p>
                    ${options}
                    <br>
                    <div class="alert alert-success" style="display:none"> <strong>¡Correcto!</strong></div>
                    <div class="alert alert-danger" style="display:none"> <strong>¡Error!</strong></div>
                    ${link}
                  </div>
                </div>
              </div> `
    }

    $('#step-buttons').append(layout.button);
    $('#steps-wrap').append(layout.step);
  })

  bind();

}


// Bind buttons and options
function bind(){
  var navListItems = $('.setup-content .btn'),
          allWells = $('.setup-content'),
          allOptions = $('.q-option'),
          allNextBtn = $('.nextBtn');

  $('#login').fadeOut(() => {
    $('#steps').fadeIn();
  });
  allWells.hide();

  allOptions.click(function(){
    let isCorrect = $(this).data('correct');
    let _class = '.alert.alert-danger';
    let $parent = $('#' + $(this).data('parent'));
    if(!$parent.hasClass('answered')){
      if(isCorrect){
        _class = '.alert.alert-success';
        ++correctCount;
      }
      $(this).addClass('selected');
      $parent.addClass('answered');
      $parent.find(_class).fadeIn();
      $parent.find('.btn').fadeIn();
    }
  })

  allWells.hide();
  $('#question-0').show();

  navListItems.click(function (e) {
      e.preventDefault();
      var $target = $($(this).attr('href')),
              $item = $(this);

      if ($(this).attr('href') != '#results') {
          navListItems.removeClass('btn-primary').addClass('btn-default');
          $item.addClass('btn-primary');
          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();
      } else {
        finished = true;
        showResults();
        socket.emit('results', correctCount);
      }
  });

}

function showResults(){
  let r = '';
  if(oponentCorrects == -1){
    r = `
            <div class="col-xs-4">
                <h3>Tus preguntas correctas</h3>
                <h1 style="font-size: 70px">${correctCount}</h1>
            </div>
            <div class="col-xs-4">
                <h3>Esperando resultados de tu oponente</h3>
            </div>
            `;
  } else {
    let info = `<br><br><div class="col-xs-12 alert alert-success" style="font-size:60px;text-align: center; margin-top: 50px;">Felicitaciones! You WON :)</div>`;
    if(oponentCorrects > correctCount)
      info = `<br><br><div class="col-xs-12 alert alert-danger" style="font-size:60px;text-align: center; margin-top: 50px;">Ups, perdiste, try again :(</div>`;
    else if(oponentCorrects == correctCount)
      info = `<br><br><div class="col-xs-12 alert alert-info" style="font-size:60px;text-align: center; margin-top: 50px;">¡Empate!</div>`;

    r = `
            <div class="col-xs-4">
                <h3>Tus preguntas correctas</h3>
                <h1 style="font-size: 70px">${correctCount}</h1>
            </div>
            <div class="col-xs-4">
              <h3>Respuestas correctas de tu oponente</h3>
              <h1 style="font-size: 70px">${oponentCorrects}</h1>
            </div>
            ${info}
            `;
  }
  $('#steps').fadeOut(() => {
    $('#results').html(r).fadeIn();
  });
}

function counting(){
  $('.count').fadeIn().html('<p>Comienza el juego en</p><h1>3</h1>');
  setTimeout(() => {
    $('.count').html('<p>Comienza el juego en</p><h1>2</h1>');
    setTimeout(() => {
      $('.count').html('<p>Comienza el juego en</p><h1>1</h1>');
      setTimeout(() => {
        $('.count').fadeOut();
      }, 1000);
    }, 1000);
  }, 1000);
}
