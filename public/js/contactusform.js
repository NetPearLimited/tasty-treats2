$(function() {
    function after_form_submitted(data) {
        if (data.success == true) {
            $('form#contactusform_form').hide();
            $('#success_message').show();
            $('#error_message').hide();
        } else {
            $('#error_message').append('<ul></ul>');

            for(let i=0; i<data.errors.length; i++){
                $('#error_message ul').append('<li>' + data.errors[i].param + ':' + data.errors[i].msg + '</li>');
            }

            $('#success_message').hide();
            $('#error_message').show();

            $('button[type="button"]', $form).each(function() {
                $btn = $(this);
                label = $btn.prop('orig_label');
                if (label) {
                    $btn.prop('type', 'submit');
                    $btn.text(label);
                    $btn.prop('orig_label', '');
                }
            });

        }  
    }
	
    $('#contactusform_form').submit(function(e) {
        e.preventDefault();

        $('#error_message ul').empty();

        $form = $(this);
        $('button[type="submit"]', $form).each(function() {
            $btn = $(this);
            $btn.prop('type', 'button');
            $btn.prop('orig_label', $btn.text());
            $btn.text('Sending ...');
        });
        postData = $form.serialize();
        console.log(postData);
        $.ajax({
            type: "POST",
            url: '/task/sendmessage',
            data: postData,
            success: after_form_submitted,
            dataType: 'json'
        });

    });
});

$(function() {
    $('#captcha_reload').on('click', function(e) {
        e.preventDefault();
        d = new Date();
        var src = $("img#captcha_image").attr("src");
        src = src.split(/[?#]/)[0];

        $("img#captcha_image").attr("src", src + '?' + d.getTime());
    });
});

 
$(function() {
$("#subscribe").change(function(){
    //alert("checked");
    if($(this).is(":checked")){
        $(this).val("yes");
        $("#subscribe-to-newsletters").val("yes");
       //  alert($(this).val());
    } else {
        $(this).val("no");
        $("#subscribe-to-newsletters").val("no");
    }
});
});