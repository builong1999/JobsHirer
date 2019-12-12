// LONG

$.ajax({
    url:'/get-sch-account/post-confirm',
    method: 'POST'
}).done(result=>{
    console.log(result)
    if (!result){
        $('#apply-now-id').remove()
    }
})

$('#apply-now-id').click(e=>{
    const URLS = window.location.href;
    const url = new URL(URLS);
    window.location.href = `/my-cv-raise?id=${url.searchParams.get('id')}`
})