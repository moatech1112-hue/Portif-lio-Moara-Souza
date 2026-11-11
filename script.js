document.addEventListener("DOMContentLoaded", () => {
  const botaoTema = document.querySelector("#tema");
  if (botaoTema) {
    botaoTema.addEventListener("click", () => {
      document.body.classList.toggle("escuro");
      const escuro = document.body.classList.contains("escuro");
      botaoTema.setAttribute("aria-pressed", escuro);
      botaoTema.textContent = escuro ? "Tema Claro" : "Alternar tema";
    });
  }

  const btnVejaMais = document.querySelector("#btn-veja-mais");
  const textoExtra = document.querySelector("#texto-extra");
  if (btnVejaMais && textoExtra) {
    btnVejaMais.addEventListener("click", () => {
      textoExtra.classList.toggle("oculto");
      const estaOculto = textoExtra.classList.contains("oculto");
      btnVejaMais.textContent = estaOculto ? "Veja mais" : "Ver menos";
    });
  }

  const formCadastro = document.querySelector("#cadastro");
  const sectionProjetos = document.querySelector("#projetos");
  const selectFiltro = document.querySelector("#filtro");
  const pStatus = document.querySelector("#status");

  function filtrarProjetos() {
    if (!selectFiltro) return;
    const filtro = selectFiltro.value;
    const projetos = document.querySelectorAll(".projeto-card");
    projetos.forEach((proj) => {
      const cat = proj.dataset.categoria;
      if (filtro === "todos" || cat === filtro) {
        proj.classList.remove("oculto");
      } else {
        proj.classList.add("oculto");
      }
    });
  }

  if (selectFiltro) {
    selectFiltro.addEventListener("change", () => {
      filtrarProjetos();
      if (pStatus) pStatus.textContent = `Filtro aplicado: ${selectFiltro.value}`;
    });
  }

  if (formCadastro) {
    formCadastro.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!formCadastro.checkValidity()) {
        formCadastro.reportValidity();
        if (pStatus) pStatus.textContent = "Erro de validação.";
        return;
      }
      const dados = new FormData(formCadastro);
      const nome = dados.get("nome").trim();
      const categoria = dados.get("categoria");

      if (nome.length < 3) {
        if (pStatus) pStatus.textContent = "O nome deve ter pelo menos 3 caracteres.";
        return;
      }

      const article = document.createElement("article");
      article.className = "projeto-card";
      article.dataset.categoria = categoria;

      const badge = document.createElement("span");
      badge.className = `badge badge-${categoria}`;
      badge.textContent = categoria;

      const h2 = document.createElement("h2");
      h2.textContent = nome;

      const p = document.createElement("p");
      p.textContent = "Novo projeto adicionado dinamicamente.";

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const btnRemover = document.createElement("button");
      btnRemover.className = "remover";
      btnRemover.type = "button";
      btnRemover.textContent = "Remover";
      btnRemover.addEventListener("click", () => article.remove());

      actions.append(btnRemover);
      article.append(badge, h2, p, actions);
      sectionProjetos.append(article);

      if (pStatus) pStatus.textContent = "Projeto adicionado com sucesso!";
      formCadastro.reset();
      filtrarProjetos();
    });
  }

  const formContato = document.getElementById("form-contato");
  if (!formContato) return;

  const campoNome = document.getElementById("nome-msg");
  const campoEmail = document.getElementById("email-msg");
  const campoMotivo = document.getElementById("motivo-msg");
  const containerAssunto = document.getElementById("container-assunto");
  const campoAssunto = document.getElementById("assunto-msg");
  const campoMensagem = document.getElementById("mensagem-msg");
  const contadorMsg = document.getElementById("contador-msg");
  const formStatus = document.getElementById("form-status");
  const btnEnviar = document.getElementById("btn-enviar-msg");

  campoMotivo.addEventListener("change", () => {
    if (campoMotivo.value === "Outro") {
      containerAssunto.classList.remove("oculto");
      campoAssunto.disabled = false;
      campoAssunto.setAttribute("required", "true");
    } else {
      containerAssunto.classList.add("oculto");
      campoAssunto.disabled = true;
      campoAssunto.removeAttribute("required");
      campoAssunto.value = ""; 
      mostrarErro(campoAssunto, "");
    }
  });

  campoMensagem.addEventListener("input", () => {
    const total = campoMensagem.value.length;
    contadorMsg.textContent = `${total}/1000`;
    if (total > 1000) {
      contadorMsg.style.color = "#ef4444";
    } else {
      contadorMsg.style.color = "inherit";
    }
  });

  function mostrarErro(campo, mensagem) {
    const idErro = campo.getAttribute("aria-describedby");
    const spanErro = document.getElementById(idErro);
    if (mensagem) {
      campo.setAttribute("aria-invalid", "true");
      if (spanErro) spanErro.textContent = mensagem;
    } else {
      campo.removeAttribute("aria-invalid");
      if (spanErro) spanErro.textContent = "";
    }
  }

  function validarCampo(campo) {
    let valor = campo.value.trim();
    let temErro = false;

    if (campo === campoNome) {
      if (!valor || valor.length < 3 || valor.length > 80) {
        mostrarErro(campo, "O nome deve ter entre 3 e 80 caracteres.");
        temErro = true;
      } else {
        mostrarErro(campo, "");
      }
    } 
    else if (campo === campoEmail) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!valor || !regexEmail.test(valor)) {
        mostrarErro(campo, "Insira um e-mail válido (ex: email@dominio.com).");
        temErro = true;
      } else {
        mostrarErro(campo, "");
      }
    }
    else if (campo === campoMotivo) {
      if (!valor) {
        mostrarErro(campo, "Selecione um motivo.");
        temErro = true;
      } else {
        mostrarErro(campo, "");
      }
    }
    else if (campo === campoAssunto && !campo.disabled) {
      if (!valor || valor.length < 5 || valor.length > 100) {
        mostrarErro(campo, "O assunto deve ter entre 5 e 100 caracteres.");
        temErro = true;
      } else {
        mostrarErro(campo, "");
      }
    }
    else if (campo === campoMensagem) {
      if (!valor || valor.length < 30 || valor.length > 1000) {
        mostrarErro(campo, "A mensagem deve ter entre 30 e 1000 caracteres.");
        temErro = true;
      } else {
        mostrarErro(campo, "");
      }
    }
    return !temErro;
  }

  [campoNome, campoEmail, campoMotivo, campoAssunto, campoMensagem].forEach(campo => {
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
      if (campo.getAttribute("aria-invalid") === "true") {
        mostrarErro(campo, "");
      }
    });
  });

  formContato.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.className = "status-msg";

    const validacoes = [
      validarCampo(campoNome),
      validarCampo(campoEmail),
      validarCampo(campoMotivo),
      validarCampo(campoMensagem)
    ];
    if (!campoAssunto.disabled) validacoes.push(validarCampo(campoAssunto));

    const formValido = validacoes.every(resultado => resultado === true);

    if (!formValido) {
      formStatus.textContent = "Corrija os erros destacados no formulário antes de enviar.";
      formStatus.classList.add("status-erro");
      const primeiroInvalido = formContato.querySelector('[aria-invalid="true"]');
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    formStatus.textContent = "Processando o envio da mensagem...";
    formStatus.style.color = "var(--accent-color)";

    const FORMSPREE_URL = "https://formspree.io/f/xyewywoq"; 
    const dadosFormulario = new FormData(formContato);

    try {
      const resposta = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: dadosFormulario,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (resposta.ok) {
        formStatus.textContent = "Mensagem enviada com sucesso! Entrarei em contato em breve.";
        formStatus.classList.add("status-sucesso");
        formContato.reset();
        contadorMsg.textContent = "0/1000";
        campoMotivo.dispatchEvent(new Event("change"));
      } else {
        throw new Error("Erro na resposta do servidor.");
      }
    } catch (erro) {
      formStatus.textContent = "Falha ao enviar a mensagem. Por favor, tente novamente.";
      formStatus.classList.add("status-erro");
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar mensagem";
    }
  });
});
