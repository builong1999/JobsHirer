const urlData = window.location.href;
const url = new URL(urlData)
const employerID = url.searchParams.get('i');
console.log(employerID)

$('#button-insert').click(e=>{
    $.ajax({
        url:'/create-cv-prof/confirm',
        method: 'POST',
        data:{
            E: $('#text-in-profile-Education').val()
            ,A: $('#text-in-profile-Academic').val()
            ,F: $('#text-in-profile-ForeignL').val()
            ,Ex: $('#text-in-profile-Experience').val()
            ,H: $('#text-in-profile-Health').val()
            ,EC: $('#text-in-profile-E_Communication').val()
            ,Co: $('#text-in-profile-Cooperation').val()
            ,P: $('#text-in-profile-Presentation').val()
            ,S: $('#text-in-profile-Salary').val()
            ,RID: employerID
        }
    }).done(result=>{

    })
})
$('#button-delete').click(e=>{
    $.ajax({
        url:'/delete-cv-prof/confirm',
        method:'POST',
        data:{
            CV_ID:$('#text-in-profile-ID').val()
        }
    })
})
$('#button-salary').click( e=>{
    $.ajax({
        url:'/search-cv-prof/confirm',
        method:'POST',
        data:
        {
            salary:$('#number-in-profile-Salary').val()
        }
    }).done(result=>{
        $('.list-CV').html('')
        result.forEach(element => {
            $('.list-CV').append(`
            <p>${element.CVC_RJID} ${element.CV_CID}  ${element.CVC_ThisID} ${element.CVC_ForeignL} ${element.CVC_Experience}  ${element.CVC_E_Communication} ${element.CVC_Cooperation} ${element.CVC_Presentation} ${element.CVC_Salary}</p>
            `)
        });
    })
})