function LOAD() {
    $.ajax({
        url: '/get-peer/recruitment',
        method: 'POST'
    }).done(result => {
        $('#list-ejprofile-id').html('')
        result.forEach(element => {
            $('#list-ejprofile-id').append(`
        <p class="horizontal-rows" id='${element.a}' >
                <span>${element.b}</span>
                <span>${element.c}</span>
        </p>
        `)
        })
    })
}
LOAD();
$('#my-prof-id').click(function(){
    console.log('Long Dep Trai')
})
var nowControl = [false, null];
$('#create-new-re-btn-id').click(e => {
    const check = $('#create-new-re-btn-id').attr('check');
    if (check == 0) {
        $('#cre-new-recruit-id-views').hide();
        $('#create-new-re-btn-id').attr('check', '1');
        $('#cre-new-recruit-id').show();
    }
    else {
        if (nowControl[0]) {
            $('#cre-new-recruit-id-views').show();
        }
        $('#create-new-re-btn-id').attr('check', '0');
        $('#cre-new-recruit-id').hide();
    }
})

$('#list-ejprofile-id').on('click', 'p', function () {
    const ID = $(this).attr('id');
    if (ID == nowControl[1]) {
        $('#cre-new-recruit-id-views').hide();
        $(this).css('background-color', 'unset');
        $(this).css('color', 'unset');
        nowControl[0] = false;
        nowControl[1] = null;
    }
    else {
        const now = $(`#list-ejprofile-id p[id = ${nowControl[1]}]`);
        now.css('background-color', 'unset');
        now.css('color', 'unset');
        $(this).css('background-color', '#3b3b3b');
        $(this).css('color', '#b2ab96');
        nowControl[0] = true;
        nowControl[1] = ID;
        $.ajax({
            url: '/get-recruitment-info/confirm',
            method: 'post',
            data: { id: ID }
        }).done(result => {
            console.log(result);
            $('#job-name-id-ip-views').text(result.a);
            $('#job-address-id-ip-views').text(result.b);
            $('#job-insurance-id-ip-views').text(result.c);
            $('#job-start-id-ip-views').text(result.d);
            $('#job-end-id-ip-views').text(result.e);
            $('#job-sal-id-ip-views').text(result.f);
            $('#job-day-id-ip-views').text(result.g);
            $('#job-description-id-ip-views').text(result.h);
        })
        $('#cre-new-recruit-id-views').show();
        $('#create-new-re-btn-id').attr('check', '0');
        $('#cre-new-recruit-id').hide();
    }
})

$('#confirmCreate').click(e => {
    $.ajax({
        url: '/create-new-recruiment/confirm',
        method: 'post',
        data: {
            a: $('#job-name-id-ip').val()
            , b: $('#job-address-id-ip').val()
            , c: $('#job-insurance-id-ip').val()
            , d: $('#job-start-id-ip').val()
            , e: $('#job-end-id-ip').val()
            , f: $('#job-sal-id-ip').val()
            , g: $('#job-day-id-ip').val()
            , h: $('#job-description-id-ip').val()
        }
    }).done(result => {
        if (result) {
            $('#job-name-id-ip').val('');
            $('#job-address-id-ip').val('');
            $('#job-insurance-id-ip').val('');
            $('#job-start-id-ip').val('');
            $('#job-end-id-ip').val('');
            $('#job-sal-id-ip').val('');
            $('#job-day-id-ip').val('');
            $('#job-description-id-ip').val('');
            $('#create-new-recruitment').show();
        }
        else {

        }
    })
    LOAD();
})

$('#confirmDelete').click(e=>{
    $('#cre-new-recruit-id-views').hide();
    $.ajax({
        url:'/request-delete-recruit/confirm',
        method:'post',
        data:{id: nowControl[1]}
    }).done(result=>{
        if(!result){

        }
    })
    LOAD();
})