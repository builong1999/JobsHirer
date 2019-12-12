$.ajax({
    url:'/get-employer-prof/confirm',
    method:'post'
}).done(result=>{
    $('#my-name-ip-id').val(result.a);
    $('#my-email-ip-id').val(result.b);
    $('#my-address-ip-id').val(result.c);
    result.d.forEach(element=>{
        $('#select-type-bsn-id').append(`
        <option value="${element.id}" >${element.name}</option>
        `)
        $('#search-btn-id').append(`
        <option value="${element.id}" >${element.name}</option>
        `)
    })
})

$('#updateInformation').click(e=>{
    $.ajax({
        url:'/update-employer-prof/confirm',
        method:'POST',
        data : {
            a: $('#my-name-ip-id').val()
            ,b:$('#my-email-ip-id').val()
            ,c:$('#my-address-ip-id').val()
            ,d:$('#select-type-bsn-id option:selected').val()
        }
    }).done(result=>{
        if(result){
            window.location.reload();
        }
    })
})

$('#delete-my-acc').click(e=>{
    window.location.href = '/remove/employer/account'
})



$('#search-btn-id').on('change', function(){
    $.ajax({
        url:'/search-recruit-by-id/confirm',
        method:'post',
        data: {data:$(this).val()}
    }).done(result=>{
        $('#list-empployer-id').html('')
        var i = 1;
        result.forEach(element=>{
            $('#list-empployer-id').append(`
                <p> <span>${i++}</span> <span>${element.b}</span> </p>
            `)
        })
    })
})