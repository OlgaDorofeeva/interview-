class Findings {
    static create(findings) {
        return fetch('https://applicants-db19e.firebaseio.com/findings.json', {
            method: 'POST',
            body: JSON.stringify(findings),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            findings.id = response.name
            return findings
        })
        .then(addToLocalStorage)
        .then(Findings.addLineFromLocalStorage)
        .catch(err => console.log(err))
    }
    static addLineFromLocalStorage() {
        const elementsFromLocalStorage = getFindingsFromLocalStorage()
        const lastElementFromLocalStorage = elementsFromLocalStorage[elementsFromLocalStorage.length - 1]
        CreateBlockLayout()
        renderLine(lastElementFromLocalStorage)
        
    }
    static receprion(){
        return fetch('https://applicants-db19e.firebaseio.com/findings.json', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {console.log(data)
                Findings.renderLineWhenRestart(data)})
    }
    static renderLineWhenRestart(data){
        for (let key in data) {
            CreateBlockLayout()
            renderLine(data[key])
        }
        
    }
}
function renderLine(dataArray){
    const countLine = document.querySelector('.hero__count')
    const lineLength = document.querySelectorAll('.hero__line').length
    const addField = [...document.querySelectorAll('.add-field')]
    const stars = [...document.querySelectorAll('.form__star')]
    const arrLastFields = addField.slice(-6)
    const arrLastStars = stars.slice(-5)
    countLine.innerHTML = lineLength
    arrLastFields.forEach(item => {
        const attr = item.getAttribute('data-name')
        dataArray.forEach(el => {
            if (attr === 'file'){
                item.setAttribute('src', el.file)
            } else
            if (attr === el.name) {
                item.innerHTML = el.value
            }
        })
    })
    const middleRating = [...document.querySelectorAll('.form__count')]
    const [...lastMiddleRating] = (middleRating[middleRating.length-1]).innerHTML
    arrLastStars.forEach((star, i) => {
        if (i < lastMiddleRating){
            star.classList.add('select')
        }
    })
}

//создание разметки страницы
function CreateBlockLayout(){
    let hero = document.querySelector('.hero__inner')
    let divLine = document.createElement('div');
    divLine.className = "hero__line line"
    divLine.innerHTML =
    `
    <div class="line__applicant">
        <img class="line__photo add-field" data-name="file" src="1" alt="photo">
        <div class="line__block-name">
            <div class="line__name add-field" data-name="name"></div>
            <span class="line__vacancy"> Вакансия:
                <span class="line__vacancy-name add-field" data-name="vacancy"></span>
            </span>
        </div>
    </div>
    <div class="line__phone-block">
        <div class="line__image">
            <svg class="line__svg">
                <use xlink:href="svg/sprite.svg#phone" />
            </svg>
        </div>
        <div class="line__phone add-field" data-name="phone"></div>
    </div>
    <div class="line__email-block">
        <div class="line__image">
            <svg class="line__svg">
                <use xlink:href="svg/sprite.svg#email" />
            </svg>
        </div>
        <div class="line__email add-field" data-name="email"></div>
    </div>
    <div class="form__block-rating">
        <span class="form__rating-text">Средняя оценка: <span class="form__count add-field" data-name="count"></span></span>
        <div class="form__svg-block">
            <svg class="form__star">
                <use xlink:href="svg/sprite.svg#star"></use>
            </svg>
            <svg class="form__star">
                <use xlink:href="svg/sprite.svg#star"></use>
            </svg>
            <svg class="form__star">
            
                <use xlink:href="svg/sprite.svg#star"></use>
            </svg>
            <svg class="form__star">
                <use xlink:href="svg/sprite.svg#star"></use>
            </svg>
            <svg class="form__star">
                <use xlink:href="svg/sprite.svg#star"></use>
            </svg>
        </div>
    </div>
    `
    hero.append(divLine)
    
}
function addToLocalStorage(findings) {
    const all = getFindingsFromLocalStorage()
    all.push(findings)
    localStorage.setItem('findings', JSON.stringify(all))
    try {
        let count = 100;
        let message = "LocalStorageIsNOTFull";
        for (let i = 0; i <= count; count + 250) {
            message += message;
            localStorage.setItem("stringData", message);
            // console.log(localStorage);
        }
    }
    catch (e) {
        console.log("Local Storage is full, Please empty data");
    }
}
function getFindingsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('findings') || '[]')
}
    
const addButton = document.querySelector('.hero__btn-add')
const cancel = document.querySelector('#cancel')
const form = document.getElementById('form')
const overlay = document.querySelector('.overlay')
const input = form.querySelectorAll('.input-block__input')
const inputFile = document.querySelector('input[type="file"]')
const inputFileName = document.querySelector ('.form__file-name')
const submitBtn = form.querySelector('#submit')
const selectedOption = form.querySelector('.form__select')

addButton.addEventListener('click', function () {
    overlay.classList.remove('hidden')
    overlay.classList.add('visible')
})
cancel.addEventListener('click', function () {
    overlay.classList.remove('visible')
    overlay.classList.add('hidden')
})
submitBtn.addEventListener('click', function () {
    
    input.forEach(input => {
        const valid = input.closest('.input-block__label').querySelector('.input-block__valid')
        valid.classList.remove('visible')
        valid.classList.remove('hidden')
        if (input.value === ''){
            overlay.classList.remove('hidden')
            overlay.classList.add('visible')
            valid.classList.add('visible')
        } else {
            valid.classList.remove('visible')
            valid.classList.add('hidden')
        }
    })
})

form.addEventListener('submit', submitFormHandler)
function submitFormHandler(e) {
    e.preventDefault()
    let middleRating = Math.round((parseInt(resumeCount.innerHTML) + parseInt(testCount.innerHTML) + parseInt(interviewCount.innerHTML)) / 3)
    
    function readFile(file, callback){ //кодируем изображение, т.к. используемый сервер принимает только json
        let reader = new FileReader();
        reader.onload = callback
        reader.readAsDataURL(file);
    }
    let arrFindings=[]
    arrFindings.push({'name': 'count','value': middleRating})

    readFile(inputFile.files[0], function(e) {    
        input.forEach(input => {
            
            let data = new FormData()
            //отправляем в formdata результат кодирования изображения
            if (input.getAttribute('type') === 'file') {
                data.append('file', e.target.result)
                data.append('name', input.name)
            } else {
                data.append('name', input.name)
                data.append('value', input.value)
            }
            let object = {};
            data.forEach(function (value, key) {
                object[key] = value;
            });
            arrFindings.push(object)
            submitBtn.disabled = true
            input.value = ''
        })
        selectedOption.options[0].selected = true
        inputFile.value = ''
        inputFileName.innerHTML = ''
        overlay.classList.add('hidden')
        
        Findings.create(arrFindings).then(() => {
            submitBtn.disabled = false
        })
    })
}

window.onload = function () {
    Findings.receprion()
}

//функция для отображения имени выбранного файла в инпут
function getFileName () {
    let file = inputFile.value;
    file = file.replace (/\\/g, "/").split ('/').pop ();
    inputFileName.innerHTML = 'Имя файла: ' + file;
}
inputFile.addEventListener('change', getFileName)

//Звезды рейтинга
let resumeStar = [...document.querySelectorAll('.form__resume-star')]
let testStar = [...document.querySelectorAll('.form__test-star')]
let interviewStar = [...document.querySelectorAll('.form__interview-star')]
let resumeCount = document.querySelector('.form__resume-count')
let testCount = document.querySelector('.form__test-count')
let interviewCount = document.querySelector('.form__interview-count')

function getRatingStar(starsArray, count){
    let starsActive
    starsArray[0].classList.add('select')
    starsArray.forEach((star, i) => {
        star.addEventListener('mouseover', function () {
            starsActive = starsArray.slice(0, i+1)
            starsActive.forEach(item => {
                item.classList.add('active')
            })
        });
        star.addEventListener('mouseleave', function () {
            starsArray.forEach((el) => {
                el.classList.remove("active")
            })
            starsArray[0].classList.add('select')
        });
        star.addEventListener('click', function () {
            count.innerHTML = i + 1
            starsArray.forEach((el) => {
                el.classList.remove("select")
            })
            starsActive.forEach(item => {
                item.classList.add('select')
            });
        })
    })  
}
getRatingStar(resumeStar, resumeCount);
getRatingStar(testStar, testCount);
getRatingStar(interviewStar, interviewCount);


