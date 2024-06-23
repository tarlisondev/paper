
const buttonLogin = document.getElementById("button-login");
const buttonCadastrar = document.getElementById("button-cadastrar");

//const baseURL = 'http://localhost/paper/backend/';
const baseURL = 'https://tatty-stretchers.000webhostapp.com/';

const createElement = (tag, text = "", html = "", id) => {
  const element = document.createElement(tag);

  if (text) element.innerText = text;
  if (html) element.innerHTML = html;
  if (id) element.setAttribute('id', id);

  return element;
}

const createElementInput = (tag, type = "text", name = "", value = "", id, placeholder = "") => {
  const element = document.createElement(tag);

  if (type) element.setAttribute('type', type)
  if (name) element.setAttribute('name', name)
  if (value) element.setAttribute('value', value)
  if (id) element.setAttribute('id', id)
  if (placeholder) element.setAttribute('placeholder', placeholder)

  return element;
}

// ATUALIZAR STATUS DA TAREFA
const taskStatus = async (id, status) => {

  const form = createElement("form", "", `

    <input type="text" name="id" value='${id}'>
    <input type="text" name="status" value='${status}'>

  `, "edit");

  const formData = new FormData(form);
  const editTask = new URLSearchParams(formData);

  const editStatus = await fetch(baseURL + "task_status.php", {
    method: "put",
    mode: "cors",
    body: editTask,
  })

  const res = await editStatus.json();
  alert(res.data);

}

// ATUALIZAR AS TAREFAS QUANDO HOUVER MUDANÇAS
const atualizarTasks = async (id_user) => {

  const response = await buscarTodasTasks(id_user);

  if (response.error === true) {
    document.querySelector("tbody").innerHTML = response.data;
  } else {

    document.querySelector("tbody").innerHTML = "";

    response.data.map((item) => {
      const myTasks = criartasks(item);
      document.querySelector("tbody").appendChild(myTasks);
    })

  }

}

// EXCLUIR TAREFAS PELO ID
const excluirTask = async (id) => {

  const excluirUmaTask = await fetch(baseURL + "task_delete.php?id=" + id, {
    method: "get",
    mode: "cors"
  })

  const res = await excluirUmaTask.json();
  alert(res.data);

}

// CRIAR UMA TAREFA 
const criartasks = (data) => {

  const tr = createElement("tr", "", "", data.id);

  const title = createElement("td", data.task, "");
  const date = createElement("td", data.create_at, "");
  const status = createElement("td");
  const option = createElement("td");

  const taskDelete = createElement("button", "🗑️", "", "");
  const select = createElement("select", "", `
  <option  value="pendente">pendente</option>
  <option  value="em andamento">em andamento</option>
  <option  value="concuido">concluido</option>`, "");

  taskDelete.addEventListener("click", async () => {
    await excluirTask(data.id);
    atualizarTasks(data.user_id);
  })

  select.addEventListener("change", async ({ target }) => {
    taskStatus(data.id, target.value);
  })

  status.appendChild(select);
  option.appendChild(taskDelete);

  tr.appendChild(title);
  tr.appendChild(date);
  tr.appendChild(status);
  tr.appendChild(option);

  return tr;

}

// BUSCAR TODAS AS TAREFAS
const buscarTodasTasks = async (id) => {

  const allTasks = await fetch(baseURL + "task_all_get.php?id=" + id, {
    method: "get",
    mode: "cors",
  })

  const res = await allTasks.json();
  return res;
}

// CRIAR O FORMULARIO DE CRIAÇÃO DE USUARIO
const formularioCriarTask = (id) => {

  const taskForm = createElement("form", "", "", "task-form");
  const taskTitle = createElement("h2", "Cadastrar Tarefa", "", "");
  const taskId = createElementInput("input", "hidden", "id", id, "id-task", "");
  const taskName = createElementInput("input", "text", "task", "", "task", "Digite seu tarefa");
  const taskButton = createElementInput("input", "submit", "btn", "Cadastrar", "task-submit");

  taskButton.addEventListener("click", async e => {
    e.preventDefault();

    const formTask = document.querySelector("#task-form");
    const formData = new FormData(formTask);

    const task = await fetch(baseURL + "task_post.php", {
      method: "post",
      mode: "cors",
      //headers: { "Content-Type": "application/json" },
      body: formData,
    })

    await atualizarTasks(id);

    const res = await task.json();
    alert(res.data);

    document.querySelector("#task-form").remove();
  })

  taskForm.appendChild(taskTitle);
  taskForm.appendChild(taskId);
  taskForm.appendChild(taskName);
  taskForm.appendChild(taskButton);

  return taskForm;
}

// CRIAR O FORMULARIO DE CRIAÇÃO DE USUARIO
const formularioCriarUsuario = () => {

  const criarForm = createElement("form", "", "", "criar-form");
  const criarTitle = createElement("h2", "Cadastrar usuario", "", "");
  const criarName = createElementInput("input", "text", "name", "", "criar-name", "Digite seu nome");
  const criarEmail = createElementInput("input", "email", "email", "", "criar-email", "Digite seu email");
  const criarPassword = createElementInput("input", "password", "password", "", "criar-password", "Digite sua senha");
  const criarButton = createElementInput("input", "submit", "btn", "Cadastrar", "criar-submit");

  criarButton.addEventListener("click", async e => {
    e.preventDefault();

    await criarUsuario();

    if (document.querySelector("#criar-form")) {
      document.querySelector("#criar-form").remove();
    }

  })

  criarForm.appendChild(criarTitle);
  criarForm.appendChild(criarName);
  criarForm.appendChild(criarEmail);
  criarForm.appendChild(criarPassword);
  criarForm.appendChild(criarButton);

  return criarForm;
}

// CRIAR O FORMULARIO DE EDIÇÃO DE USUARIO
const formularioEditarUsuario = async (id) => {

  const { data } = await buscarUsuarioId(id);

  const editForm = createElement("form", "", "", "edit-form");
  const editTitle = createElement("h2", "Editar usuario", "", "");
  const editId = createElementInput("input", "hidden", "id", data.id, "edit-id");
  const editName = createElementInput("input", "text", "name", data.name, "edit-name");
  const editEmail = createElementInput("input", "email", "email", data.email, "edit-email");
  const editPassword = createElementInput("input", "password", "password", "", "edit-password", "Digite sua senha atual");
  const editButton = createElementInput("input", "submit", "btn", "Confirmar", "edit-submit");

  editForm.appendChild(editTitle);
  editForm.appendChild(editId);
  editForm.appendChild(editName);
  editForm.appendChild(editEmail);
  editForm.appendChild(editPassword);
  editForm.appendChild(editButton);

  editButton.addEventListener("click", async e => {
    e.preventDefault();
    await editarUsuario();
    document.body.removeChild(document.querySelector("#edit-form"));
  })

  document.body.appendChild(editForm);
}

// CRIAR O FORMULARIO DE LOGIN DO USUARIO
const formularioLoginUsuario = () => {

  const loginForm = createElement("form", "", "", "login-form");
  const loginTitle = createElement("h2", "Fazer Login", "", "");
  const loginEmail = createElementInput("input", "email", "email", "", "login-email", "Digite seu email");
  const loginPassword = createElementInput("input", "password", "password", "", "login-password", "Digite sua senha atual");
  const loginButton = createElementInput("input", "submit", "btn", "Logar", "login-submit");

  loginButton.addEventListener("click", async e => {
    e.preventDefault();

    await loginUsuario();

    if (document.querySelector("#login-form")) {
      document.querySelector("#login-form").remove();
    }

  })

  loginForm.appendChild(loginTitle);
  loginForm.appendChild(loginEmail);
  loginForm.appendChild(loginPassword);
  loginForm.appendChild(loginButton);

  return loginForm;
}

// FAZER LOGIN 
const loginUsuario = async () => {

  const loginForm = document.querySelector("#login-form");
  const formData = new FormData(loginForm);

  const login = await fetch(baseURL + "user_sign.php", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: formData,
  })

  const data = await login.json();

  if (data.data.status === true) {
    document.querySelector("#title").innerHTML = "<h2>" + data.data.email + "</h2>";
    buttonLogin.style.display = "none";
    buttonCadastrar.style.display = "none";
    document.body.removeChild(document.querySelector("#login-form"));

    const table = `
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Data</th>
          <th>Status</th>
          <th>Option</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    `
    document.querySelector("section").innerHTML = table;

    const excluirButton = createElement("button", "Excluir", "", "excluir-button");
    const editarButton = createElement("button", "Editar", "", "editar-button");
    const sairButton = createElement("button", "Sair", "", "sair-button");
    const newTask = createElement("button", "new Task", "", "new-task");

    excluirButton.addEventListener("click", () => {
      const del = confirm("Tem certeze que deseja excluir sua conta?");

      if (del) {

        excluirUsuario(data.data.id);
        window.location.reload();

      } else {
        alert("Exclusão cancelada.");
      }
    })

    editarButton.addEventListener("click", () => {

      if (document.querySelector("#edit-form")) {
        return;
      }

      formularioEditarUsuario(data.data.id);
    })

    sairButton.addEventListener("click", () => {
      //localStorage.removeItem("id");
      window.location.reload();
    })

    newTask.addEventListener("click", () => {

      if (document.querySelector("#task-form")) {
        return;
      }

      const criarTask = formularioCriarTask(data.data.id);
      document.querySelector("section").appendChild(criarTask);

    })

    const response = await buscarTodasTasks(data.data.id);

    if (response.error === true) {
      document.querySelector("tbody").innerHTML = response.data;
    } else {

      response.data.map((item) => {
        const myTasks = criartasks(item);
        document.querySelector("tbody").appendChild(myTasks);
      })

    }

    document.querySelector("#menu").appendChild(excluirButton);
    document.querySelector("#menu").appendChild(editarButton);
    document.querySelector("#menu").appendChild(sairButton);
    document.body.appendChild(newTask);

  } else {
    alert(data.data);
  }

}

// EXCLUIR O USUARIO DO BANCO DE DADOS
const excluirUsuario = async (id) => {

  const formData = new FormData;
  formData.append("id", id);
  const user = new URLSearchParams(formData);

  const exluir = await fetch(baseURL + "user_delete.php", {
    method: "delete",
    mode: "cors",
    body: user,
  })

  const res = await exluir.json();
  alert(res.data);
}

// EDITAR NOME E EMAIL DO USUARIO
const editarUsuario = async () => {

  const editForm = document.querySelector("#edit-form");

  const formData = new FormData(editForm);
  const user = new URLSearchParams(formData);

  const edit = await fetch(baseURL + "user_put.php", {
    method: "put",
    mode: "cors",
    body: user,
  })
  const res = await edit.json();
  if (res.data.status === true) {
    alert(res.data.message);
  }
  alert(res.data);
  return

}

// CADASTRAR USUARIO NO BANCO DE DADOS
const criarUsuario = async () => {

  const criarForm = document.querySelector("#criar-form");
  const formData = new FormData(criarForm);

  const criar = await fetch(baseURL + "user_post.php", {
    method: "post",
    mode: "cors",
    //headers: { "Content-Type": "application/json", },
    body: formData
  })

  const data = await criar.json();

  if (data.data.status === true) {

    alert(data.data.message);
    document.body.removeChild(document.querySelector("#criar-form"));

  } else {
    alert(data.data);
  }

}

// PEGA USUARIO PELO ID
const buscarUsuarioId = async (id) => {
  const data = await fetch(baseURL + "user_get.php?id=" + id, {
    method: "get",
    mode: "cors",
  });

  const res = await data.json();
  //console.log(res);
  return res;

}

buttonLogin.addEventListener("click", () => {
  const loginForm = formularioLoginUsuario();

  if (document.querySelector("#criar-form")) {
    document.body.removeChild(document.querySelector("#criar-form"));
  }

  if (document.querySelector("#login-form")) {
    return;
  }

  document.body.appendChild(loginForm);

})

buttonCadastrar.addEventListener("click", () => {

  const criarForm = formularioCriarUsuario();

  if (document.querySelector("#login-form")) {
    document.body.removeChild(document.querySelector("#login-form"));
  }

  if (document.querySelector("#criar-form")) {
    return;
  }

  document.body.appendChild(criarForm);

})

// OCULTAR FORMULARIOS
document.querySelector("#logo").addEventListener("click", () => {

  if (document.querySelector("#criar-form")) {
    document.body.removeChild(document.querySelector("#criar-form"));
  }

  if (document.querySelector("#login-form")) {
    document.body.removeChild(document.querySelector("#login-form"));
  }

  if (document.querySelector("#edit-form")) {
    document.body.removeChild(document.querySelector("#edit-form"));
  }

})

