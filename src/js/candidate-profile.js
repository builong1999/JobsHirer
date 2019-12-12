$('#btn_updateProfile_id').click(e=>{
    $.ajax(
        {
        url: '/update-profile/confirm',
        method: 'POST',
        data:{
            name: $('#text-in-profile-name').val(),
            addr: $('#text-in-profile-addr').val(),
            contact: $('#text-in-profile-contact').val(),
            email: $('#text-in-profile-email').val(),
            dob: $('#text-in-profile-dob').val(),
            cmnd: $('#text-in-profile-cmnd').val(),
            sex: $('#text-in-profile-sex').val(),
            spec: $('#text-in-profile-spec').val()
        }
    }
    ).done(result=>{
        if(result == true) alert('Update done');
    })
})

$('#btn_deleteProfile_id').click(e=>{
    $.ajax(
        {
            url: '/delete-profile/confirm',
            method: 'POST'
        }
    )
})