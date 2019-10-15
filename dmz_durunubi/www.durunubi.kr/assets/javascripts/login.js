var failed = {"id" : "","tried" : 0};
		

function login() {
    var action = $("#loginForm").attr('action');
    var form_data = JSON.stringify($("#loginForm").serializeArray());
    var principal = $("input[name=principal]").val();
    var credencials = $("input[name=credencials]").val();
    var remember_me = $("input[name=remember-me]").prop("checked");
    var data = {
        principal : principal,
        credentials : credencials,
        remember_me : remember_me
    };    
    $.ajax({
        type : "POST",
        url : action,
        data : JSON.stringify(data),
        contentType:"application/json; charset=utf8;",
        success : function(response) {
        	if(response.success) {
        		window.location.reload();	
        	}else {
        		if(response.error.status == 401) {
        			alert('패스워드가 틀렸습니다.');
        			if(retryCheck(principal) > 2) {
        				openHint(response.error.message);
        			}
        			$("input[name=credencials]").empty();
        			
        		}else if(response.error.status == 400) {
        			alert('로그인에 실패하였습니다. ID를 확인해 주세요');
        		}
        	}
            
        }
    });
    return false;
}

function retryCheck(principal) {
	if(failed.id == principal) {
		failed.tried+=1;	
	}else {
		failed.id = principal;
		failed.tried = 1;
	}
	
	return failed.tried;
}

function openHint(message) {
	$("#hintBox").css("display","block");
	$("#passwordHint").text(message);	
}