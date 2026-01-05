// Script para gestionar usuarios registrados de forma unificada
// Este script centraliza la gestión de usuarios y sincroniza con localStorage

class GestorUsuarios {
    constructor() {
        this.claveUsuarios = 'usuariosRegistrados';
        this.claveUsuarioActivo = 'usuarioActivo';
        this.archivoUsuarios = './usuarios_registrados.json';
    }

    // Obtener todos los usuarios registrados
    obtenerUsuarios() {
        try {
            const usuarios = localStorage.getItem(this.claveUsuarios);
            return usuarios ? JSON.parse(usuarios) : [];
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }

    // Guardar usuarios en localStorage
    guardarUsuarios(usuarios) {
        try {
            localStorage.setItem(this.claveUsuarios, JSON.stringify(usuarios));
            // También intentar sincronizar con archivo JSON (simulado)
            this.sincronizarConArchivo(usuarios);
            return true;
        } catch (error) {
            console.error('Error al guardar usuarios:', error);
            return false;
        }
    }

    // Agregar nuevo usuario
    agregarUsuario(datosUsuario) {
        const usuarios = this.obtenerUsuarios();
        
        // Verificar si el usuario ya existe por email
        const indiceExistente = usuarios.findIndex(u => u.email === datosUsuario.email);
        
        if (indiceExistente >= 0) {
            // Actualizar usuario existente
            usuarios[indiceExistente] = { ...usuarios[indiceExistente], ...datosUsuario };
        } else {
            // Agregar nuevo usuario
            usuarios.push(datosUsuario);
        }
        
        // Ordenar alfabéticamente por nombre
        usuarios.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        
        return this.guardarUsuarios(usuarios);
    }

    // Obtener usuario por email
    obtenerUsuarioPorEmail(email) {
        const usuarios = this.obtenerUsuarios();
        return usuarios.find(u => u.email === email);
    }

    // Validar estructura de datos del usuario
    validarDatosUsuario(datos) {
        const camposRequeridos = ['nombre', 'apellido', 'email'];
        const errores = [];

        camposRequeridos.forEach(campo => {
            if (!datos[campo] || !datos[campo].toString().trim()) {
                errores.push(`El campo ${campo} es obligatorio`);
            }
        });

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (datos.email && !emailRegex.test(datos.email)) {
            errores.push('El formato del email no es válido');
        }

        // Validar cédula si existe
        if (datos.cedula && !/^[0-9]{6,10}$/.test(datos.cedula)) {
            errores.push('La cédula debe tener entre 6 y 10 dígitos');
        }

        // Validar teléfono si existe
        if (datos.telefono && !/^[0-9]{7,10}$/.test(datos.telefono)) {
            errores.push('El teléfono debe tener entre 7 y 10 dígitos');
        }

        // Validar NIT si existe
        if (datos.nit && !/^[0-9]{9,12}$/.test(datos.nit)) {
            errores.push('El NIT debe tener entre 9 y 12 dígitos');
        }

        return errores;
    }

    // Establecer usuario activo
    establecerUsuarioActivo(datosUsuario) {
        try {
            localStorage.setItem(this.claveUsuarioActivo, JSON.stringify(datosUsuario));
            return true;
        } catch (error) {
            console.error('Error al establecer usuario activo:', error);
            return false;
        }
    }

    // Obtener usuario activo
    obtenerUsuarioActivo() {
        try {
            const usuario = localStorage.getItem(this.claveUsuarioActivo);
            return usuario ? JSON.parse(usuario) : null;
        } catch (error) {
            console.error('Error al obtener usuario activo:', error);
            return null;
        }
    }

    // Cerrar sesión
    cerrarSesion() {
        localStorage.removeItem(this.claveUsuarioActivo);
        // También limpiar otras claves de usuario que puedan existir
        localStorage.removeItem('usuarioActual');
        localStorage.removeItem('perfilUsuario');
    }

    // Sincronizar con archivo JSON (simulado con download)
    sincronizarConArchivo(usuarios) {
        try {
            // Crear contenido JSON formateado
            const contenidoJSON = JSON.stringify(usuarios, null, 2);
            
            // En un entorno real, esto se enviaría al servidor
            // Por ahora, simulamos la sincronización mostrando el contenido
            console.log('Sincronizando usuarios con archivo JSON:', contenidoJSON);
            
            // Opcional: Crear descarga del archivo JSON actualizado
            this.descargarArchivoJSON(contenidoJSON);
        } catch (error) {
            console.error('Error al sincronizar con archivo:', error);
        }
    }

    // Crear descarga del archivo JSON
    descargarArchivoJSON(contenido) {
        const blob = new Blob([contenido], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios_registrados.json';
        a.style.display = 'none';
        
        document.body.appendChild(a);
        // No hacer click automático, solo preparar para descarga manual si se necesita
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Migrar datos existentes (para limpiar inconsistencias)
    migrarDatosExistentes() {
        // Obtener datos de todas las posibles claves
        const usuarios1 = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarios2 = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        const perfilUsuario = JSON.parse(localStorage.getItem('perfilUsuario') || 'null');
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

        // Combinar todos los usuarios
        const todosUsuarios = [];
        
        // Agregar usuarios de la primera clave
        usuarios1.forEach(u => {
            if (u.email) {
                const datosUsuario = {
                    nombre: u.name ? u.name.split(' ')[0] : '',
                    apellido: u.name ? u.name.split(' ').slice(1).join(' ') : '',
                    email: u.email,
                    password: u.pass, // Mantener contraseña para login
                    boletin: false
                };
                todosUsuarios.push(datosUsuario);
            }
        });

        // Agregar usuarios de la segunda clave
        usuarios2.forEach(u => {
            if (u.email && !todosUsuarios.find(existing => existing.email === u.email)) {
                todosUsuarios.push(u);
            }
        });

        // Agregar perfil de usuario actual si existe
        if (perfilUsuario && perfilUsuario.email) {
            const indice = todosUsuarios.findIndex(u => u.email === perfilUsuario.email);
            if (indice >= 0) {
                todosUsuarios[indice] = { ...todosUsuarios[indice], ...perfilUsuario };
            } else {
                todosUsuarios.push(perfilUsuario);
            }
        }

        // Guardar datos unificados
        this.guardarUsuarios(todosUsuarios);

        // Establecer usuario activo si existe
        if (usuarioActivo || usuarioActual) {
            const usuario = usuarioActivo || usuarioActual;
            this.establecerUsuarioActivo(usuario);
        }

        // Limpiar claves antiguas
        localStorage.removeItem('usuarios');
        if (perfilUsuario) localStorage.removeItem('perfilUsuario');
        if (usuarioActual) localStorage.removeItem('usuarioActual');

        console.log('Migración de datos completada:', todosUsuarios.length, 'usuarios encontrados');
        return todosUsuarios;
    }

    // Obtener estadísticas de usuarios
    obtenerEstadisticas() {
        const usuarios = this.obtenerUsuarios();
        return {
            total: usuarios.length,
            conTelefono: usuarios.filter(u => u.telefono).length,
            suscritos: usuarios.filter(u => u.boletin).length,
            conDireccion: usuarios.filter(u => u.direccion).length,
            personasJuridicas: usuarios.filter(u => u.nit || u.razon).length
        };
    }
}

// Crear instancia global del gestor
window.gestorUsuarios = new GestorUsuarios();

// Ejecutar migración al cargar
document.addEventListener('DOMContentLoaded', function() {
    // Migrar datos existentes para unificar el sistema
    window.gestorUsuarios.migrarDatosExistentes();
    
    // Mostrar estadísticas en consola para debugging
    console.log('Estadísticas de usuarios:', window.gestorUsuarios.obtenerEstadisticas());
});
