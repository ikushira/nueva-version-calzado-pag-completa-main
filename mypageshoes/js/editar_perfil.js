// Validaciones y funcionalidad de edición de perfil

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEditarPerfil');
    const msg = document.getElementById('msg-editar');
    const btnJuridica = document.getElementById('btnJuridica');
    const camposJuridica = document.getElementById('campos-juridica');

    // Precargar datos del usuario si existen
    let datosUsuario = null;
    
    // Intentar obtener datos usando el gestor unificado
    if (window.gestorUsuarios) {
        const usuarioActivo = window.gestorUsuarios.obtenerUsuarioActivo();
        if (usuarioActivo && usuarioActivo.email) {
            datosUsuario = window.gestorUsuarios.obtenerUsuarioPorEmail(usuarioActivo.email);
        }
    }
    
    // Fallback: buscar en localStorage tradicional
    if (!datosUsuario) {
        const datosGuardados = localStorage.getItem('perfilUsuario');
        if (datosGuardados) {
            try {
                datosUsuario = JSON.parse(datosGuardados);
            } catch (e) {
                console.error('Error al parsear datos del perfil:', e);
            }
        }
    }
    
    // Precargar formulario con datos existentes
    if (datosUsuario) {
        if (datosUsuario.nombre) form.nombre.value = datosUsuario.nombre;
        if (datosUsuario.apellido) form.apellido.value = datosUsuario.apellido;
        if (datosUsuario.email) form.email.value = datosUsuario.email;
        if (datosUsuario.cedula) form.cedula.value = datosUsuario.cedula;
        if (datosUsuario.telefono) form.telefono.value = datosUsuario.telefono;
        if (datosUsuario.genero) form.genero.value = datosUsuario.genero;
        if (datosUsuario.fecha) form.fecha.value = datosUsuario.fecha;
        if (typeof datosUsuario.boletin !== 'undefined') form.boletin.checked = datosUsuario.boletin;
        
        // Mostrar campos de persona jurídica si hay datos
        if ((datosUsuario.nit && datosUsuario.nit.length > 0) || (datosUsuario.razon && datosUsuario.razon.length > 0)) {
            camposJuridica.classList.remove('campos-juridica-oculto');
            if (datosUsuario.nit) form.nit.value = datosUsuario.nit;
            if (datosUsuario.razon) form.razon.value = datosUsuario.razon;
        }
    }

    btnJuridica.addEventListener('click', function(e) {
        e.preventDefault();
        if (camposJuridica.classList.contains('campos-juridica-oculto')) {
            camposJuridica.classList.remove('campos-juridica-oculto');
        } else {
            camposJuridica.classList.add('campos-juridica-oculto');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        msg.style.display = 'none';
        let errores = [];
        if (!form.nombre.value.trim()) errores.push('El nombre es obligatorio.');
        if (!form.apellido.value.trim()) errores.push('El apellido es obligatorio.');
        if (!form.cedula.value.match(/^[0-9]{6,10}$/)) errores.push('La cédula debe tener entre 6 y 10 dígitos.');
        if (form.telefono.value && !form.telefono.value.match(/^[0-9]{7,10}$/)) errores.push('El teléfono debe tener entre 7 y 10 dígitos.');
        if (!camposJuridica.classList.contains('campos-juridica-oculto')) {
            if (!form.nit.value.match(/^[0-9]{9,12}$/)) errores.push('El NIT debe tener entre 9 y 12 dígitos.');
            if (!form.razon.value.trim()) errores.push('La razón social es obligatoria.');
        }
        if (errores.length > 0) {
            msg.style.display = 'block';
            msg.style.color = '#d21c32';
            msg.textContent = errores.join(' ');
            return;
        }
        // Recopilar datos del perfil
        const datosPerfil = {
            nombre: form.nombre.value.trim(),
            apellido: form.apellido.value.trim(),
            email: form.email.value.trim(),
            cedula: form.cedula.value.trim(),
            telefono: form.telefono.value.trim(),
            genero: form.genero.value,
            fecha: form.fecha.value,
            boletin: form.boletin.checked,
            nit: form.nit ? form.nit.value.trim() : '',
            razon: form.razon ? form.razon.value.trim() : '',
            fechaActualizacion: new Date().toISOString()
        };

        // Validar datos usando el gestor de usuarios
        if (window.gestorUsuarios) {
            const erroresValidacion = window.gestorUsuarios.validarDatosUsuario(datosPerfil);
            if (erroresValidacion.length > 0) {
                msg.style.display = 'block';
                msg.style.color = '#d21c32';
                msg.textContent = erroresValidacion.join(' ');
                return;
            }

            // Guardar usando el gestor unificado
            const guardadoExitoso = window.gestorUsuarios.agregarUsuario(datosPerfil);
            
            if (!guardadoExitoso) {
                msg.style.display = 'block';
                msg.style.color = '#d21c32';
                msg.textContent = 'Error al guardar los datos. Inténtalo de nuevo.';
                return;
            }

            // Actualizar usuario activo
            const usuarioActivo = window.gestorUsuarios.obtenerUsuarioActivo();
            if (usuarioActivo) {
                window.gestorUsuarios.establecerUsuarioActivo({
                    ...usuarioActivo,
                    name: `${datosPerfil.nombre} ${datosPerfil.apellido}`,
                    email: datosPerfil.email
                });
            }
        } else {
            // Fallback si el gestor no está disponible
            localStorage.setItem('perfilUsuario', JSON.stringify(datosPerfil));
            let usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
            const idx = usuarios.findIndex(u => u.email === datosPerfil.email);
            if (idx >= 0) {
                usuarios[idx] = datosPerfil;
            } else {
                usuarios.push(datosPerfil);
            }
            usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
            localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
        }

        // Confirmación visual
        msg.style.display = 'block';
        msg.style.color = '#1a8cff';
        msg.textContent = 'Datos Actualizados';
        setTimeout(() => {
            window.location.href = 'cuenta.html';
        }, 1800);
    });
});
