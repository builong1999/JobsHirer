// LONG
$('#sign-id').click((e)=>{
    $('.Sign-tabs').show();
    $('.watermark-fullscreen').show();
})
$('#cls-sign-tabs-id').click((e)=>{
    $('.Sign-tabs').hide();
    $('.watermark-fullscreen').hide();
})
$('#su-id-click').click(event=>{
    $('#su-body-id').show();
    $('#su-id-click').css('background-color','#e9eff4')
    $('#su-id-click').css('color','black')
    $('#si-body-id').hide();
    $('#si-id-click').css('background-color','white')
    $('#si-id-click').css('color','grey')
})
$('#si-id-click').click(event=>{
    $('#si-body-id').show();
    $('#si-id-click').css('background-color','#e9eff4')
    $('#si-id-click').css('color','black')
    $('#su-body-id').hide();
    $('#su-id-click').css('background-color','white')
    $('#su-id-click').css('color','grey')
})

$('#LOGO').click(e=>{
    window.location.href = '/'
})

function fixFunctionShow(val){
    if(val == -1){
        $('.admin-function').show();
    }
    else if(val == 0){
        console.log('ok')
        $('.candidate-function').show();
    }
    else{
        $('.employer-function').show();
    }
}

$(document).ready(
    $.ajax({
        url: '/get-now/status',
        method: 'POST',
    }).done(result => {
        if (result[0]) {
            const data = result[0].split(' ');
            $('.control-tool-option').show();
            $('#ses-user-name').text(data[data.length-1])
            $('#ses-user-name').show();
            $('#sign-id').remove();
            $('#out-id').show();
            fixFunctionShow(result[1]);
            $('nav').css('width','86.5vw')
            $('nav').css('margin-left','13vw')
        }
        $.ajax({
            url:'/get-full-rec-job/confirm',
            method:'POST'
        }).done(result=>{
            result.forEach(element => {
                $('#tbl-new-rj-id').append(`
                <p id='${element.f}' >
                        <span>${element.a}</span>
                        <span>${element.b}</span>
                        <span>${element.c.substring(0,10)}</span>
                        <span>${element.d.substring(0,10)}</span>
                        <span>${element.e}</span>
                    </p>
                `)
            });
        })
    })
)


var SICheck = [false,false]
var SUCHECK = [false,false,false]

function siAlert(){
    $("#mail-si-alert").hide();
    $("#pw-si-alert").hide();
    if (!SICheck[0]){
        $('.sign-in-alert').show();
        $("#mail-si-alert").show();
    }
    if (!SICheck[1]){
        $('.sign-in-alert').show();
        $("#pw-si-alert").show();
    }
}
function suAlert(){
    $("#mail-su-alert").hide();
    $("#name-su-alert").hide();
    $("#pw-su-alert").hide();
    if (!SUCHECK[0]){
        $('.sign-up-alert').show();
        $("#mail-su-alert").show();
    }
    if (!SUCHECK[1]){
        $('.sign-up-alert').show();
        $("#name-su-alert").show();
    }
    if (!SUCHECK[2]){
        $('.sign-up-alert').show();
        $("#pw-su-alert").show();
    }
}

$('#email-si-option-id').keyup(event=>{
    const text = $('#email-si-option-id').val();
    if(text.includes(' ') || !text.includes('@')){
        SICheck[0] = false;
    }
    else{
        SICheck[0] = true;
    }
    siAlert();
})

$('#pw-si-option-id').keyup(event=>{
    const text = $('#pw-si-option-id').val();
    if(!text.match(/[a-zA-Z0-9]/i)){
        SICheck[1] = false;
    }
    else{
        SICheck[1] = true;
    }
    siAlert();
})

$('#uname-su-opion-id').keyup(e=>{
    const text = $('#uname-su-opion-id').val();
    if ( text.length == 0){
        SUCHECK[1] = false
    }
    else{
        SUCHECK[1] = true;
    }
    suAlert();
})
$('#email-su-opion-id').keyup(e=>{
    const text = $('#email-su-opion-id').val();
    if ( text.length == 0 ||  !text.includes('@')){
        SUCHECK[0] = false
    }
    else{
        $.ajax({
            url:'/check/su-avai',
            method:'POST',
            data:{
                mail:text
            }
        }).done(result=>{
            SUCHECK[0] = result;
        })
    }
    suAlert();
})
$('#pw-su-opion-id').keyup(e=>{
    const text = $('#pw-su-opion-id').val();
    if ( text.length <6 ||  text.includes(' ')){
        SUCHECK[2] = false
    }
    else{
        SUCHECK[2] = true;
    }
    suAlert();
})

$('#btn-sign-in-access').click(e=>{
    if (SICheck[0] && SICheck[1]){
        $.ajax({
            url:'login/confirm',
            method:"POST",
            data:{
                username:$('#email-si-option-id').val(),
                password:$('#pw-si-option-id').val()
            }
        }).done(bool=>{
            if(bool){
                window.location.href ='/';
            }
        })
    }
    else{
        siAlert();
    }
})
$('#out-id').click(e=>{
    $.ajax({
        url:'/logout/confirm',
        method:'GET'
    }).done(result=>{
        if(result){
            location.reload();
        }
    })
})

$('#btn-submit-su-id').click(e=>{
    if (SUCHECK[0] && SUCHECK[1] && SUCHECK[2]){
        $.ajax({
            url:'/create-new-account/confirm',
            method:'POST',
            data:{
                yourname:$('#uname-su-opion-id').val(),
                username:$('#email-su-opion-id').val()
                ,password:$('#pw-su-opion-id').val()
                ,AType:$('#acc-type-selec-box-id').children('option:selected').val()
            }
        }).done(result=>{
            if (result){
                $('#email-si-option-id').val($('#email-su-opion-id').val());
                $('#pw-si-option-id').val($('#pw-su-opion-id').val());
                $('#btn-sign-in-access').click();
            }
        })
    }
    else{
        suAlert();
    }
})

$('#searchBtnID').click(e=>{
    const Sal = $('#search-slr-id').val();
    if (Sal.length != 0){
        $.ajax({
            url:'/get-goe-salary/confirm',
            method:'post',
            data:{sal: Sal}
        }).done(result=>{
            $('#tbl-new-rj-id').html('')
            result.forEach(element=>{
                $('#tbl-new-rj-id').append(`
                <p id='${element.f}' >
                        <span>${element.a}</span>
                        <span>${element.b}</span>
                        <span>${element.c.substring(0,10)}</span>
                        <span>${element.d.substring(0,10)}</span>
                        <span>${element.e}</span>
                    </p>
            `)
            })
        })
    }
    else{
        const Emp = $('#rj-search-select-id option:selected').val();
        if (Emp != -1){
            $.ajax({
                url:'/get-employer/confirm',
                method:'post',
                data:{EID:Emp}
            }).done(result=>{

            })
        }
    }
})

$('#tbl-new-rj-id').on('click','p',function(){
    const text = $(this).attr('id');
    window.open('/recruitment-job/analyst-?id='+text);
})


// Mình đặt vài cái url cho nó thống nhất, ae đỡ phải đặt cái mới nhé
$('#employ-f-id').click(e=>{
    window.location.href = '/my-recruitment-job-raise'
})

// URL truy cập my profile của Account || Employer || Admin ( Linh,  Huy)
$('#my-prof-id').click(e=>{
    window.location.href = '/my-profile-ser'
})

// URL truy cập Business type của admin <<Tuấn>>
$('#bsn-type-id').click(e=>{
    window.location.href = "/business-type-show"
})

// URL truy cập MY Blog của candidate <<Huy>>
$('#bsn-type-id').click(e=>{
    window.location.href = "/my-blog-raise"
})

// URL truy cập MY CV của candidate <<Dệ>>
$('#bsn-type-id').click(e=>{
    window.location.href = "/my-cv-raise"
})