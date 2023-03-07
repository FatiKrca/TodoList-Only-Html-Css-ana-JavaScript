//tüm elementleri seçmek
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBod = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

 eventListeners();

//tüm event listenerlar
function eventListeners(){

    form.addEventListener("submit",addTod);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}
//Yardımcı Fonksiyonlar
function showAlert(type,message){
    // <div class="alert alert-danger" role="alert">
    // This is a danger alert—check it out!
    // </div>
//yukarıdaki yapıyı oluşturcaz.
const alert = document.createElement("div");
alert.className =  `alert alert-${type}` ;
alert.textContent = message;
alert.role ="alert";

//alert mesajının card body eklenmesi
firstCardBod.appendChild(alert);

//alert  mesajının ekrana gelip sonra silinmesi
setTimeout(function(){
alert.remove();
},500);

}

//İnput olarak alınan todo'yu alt listeye item olarak ekleme
function addTodoToUI(newTodo){

    //Listeye yeni eleman eklendiğinde bir list elemanı eklenmeli
    //bu liste elemanaını li ve linin içinde a var onları oluşturmalıyız
    //daha sonra parametre olarak gelen newTodoyu oluşturduğumuz elemanın çine atıcaz

    //List Item Oluşturma li
    const listItem = document.createElement("li");
    listItem.className="list-group-item d-flex justify-content-between";

    //link oluşturma a
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    //text node ekleme--> new todo nun eklendiği yer
    listItem.appendChild(document.createTextNode(newTodo));

    listItem.appendChild(link);

    //todo liste list itemi ekleme
    todoList.appendChild(listItem);

    //ekledikten sonra textin içinin boşaltır
    todoInput.value="";

}
//storageden bütün todoları alır
function getTodosFromStorage(){
    let todos;

    if(localStorage.getItem("todos")===null){
       todos=[];
    }
    else{
       todos =JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
function addTodoToStorage(newTodo){
    let todos =getTodosFromStorage(); 
    todos.push(newTodo);
    
    localStorage.setItem("todos",JSON.stringify(todos));
}
function deleteTodoFromStorage(deletetodo){
    let todos= getTodosFromStorage();
    todos.forEach(function(todo,index){
         if(todo=== deletetodo){
            todos.splice(index,1);// storageden silme işlemi istediğimiz indexi bulup spilceye yolladık
         }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
 
 }

 function IsThere(newTodo){
    let todos= getTodosFromStorage();
    let bool = 0;
    todos.forEach(function(todo){
         if(todo === newTodo){
             bool=1;   
         }
    });

    return bool;
 }


//Ana Fonksiyonlar
function addTod(e){
    //trim() baştaki ve sondaki fazlalık boşlukları siler
    const newTodo = todoInput.value.trim();

    if(newTodo===""){

 
        showAlert("danger","Lütfen Todo Girin" );
    }
    else 
    if(1 == IsThere(newTodo)){
        showAlert("danger","Bu todo zaten var!" );

    }
    else{
   //İnput olarak alınan todo'yu alt listeye item olarak ekleme
   addTodoToUI(newTodo);
   addTodoToStorage(newTodo);

   showAlert("success","Ekleme Başarılı" )


    }
    e.preventDefault();
}

//sayfa yüklendiğinde storagedeki verilerin listeye gelmesi
function loadAllTodosToUI(){
    
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}

//çarpıya tıklanınca itemin silinmesi
function deleteTodo(e){

    //çarpıya tıklayıp tıklamadığımızın kontrolü
    if(e.target.className === "fa fa-remove"){

        //bizim çarpıda tıkladığımız şey htmledeki i ama silmek istediğimiz şey tüm li
        //o yüzden i nin parenti a anın parentı li ye gidip siliyorz
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Silme işlemi başarılı");
    }
}

//filtreleme
function filterTodos(e){

    const filterValue= e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue)===-1){
            //bulamadı
            listItem.setAttribute("style","display : none !important");
        }
        else{
            listItem.setAttribute("style","display : block");
        }

    })
}



function clearAllTodos(e){
    if(confirm("Tüm elemanları silmek isteğinizie emin misiniz")){
        showAlert("success","Silme işlemi başarılı");
        localStorage.removeItem("todos");
        //todoList.innerHTML = ""//yavaş

        //hızlı
        while(todoList.firstChild !=null){
            todoList.removeChild(todoList.firstElementChild);
        }

    }

}


