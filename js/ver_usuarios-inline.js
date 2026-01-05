/**
 * ver_usuarios-inline.js
 * Script extraído de ver_usuarios.html
 * Convertido de script inline a archivo separado
 */

(function() {
    'use strict';
    
    // Código original del script inline
    // Mostrar usuarios registrados desde localStorage usando gestor unificado
    document.addEventListener('DOMContentLoaded', function() {
        let usuarios = [];
        
        // Usar gestor unificado si está disponible
        if (window.gestorUsuarios) {
            usuarios = window.gestorUsuarios.obtenerUsuarios();
            
            // Mostrar estadísticas en la consola
            const stats = window.gestorUsuarios.obtenerEstadisticas();
            console.log('Estadísticas de usuarios:', stats);
        } else {
            // Fallback
            usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        }
        
        const tbody = document.querySelector('#tablaUsuarios tbody');
        tbody.innerHTML = '';
        
        if (usuarios.length === 0) {
            // Mostrar mensaje si no hay usuarios
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="10" style="text-align: center; padding: 32px; color: #666;">
                    <i class="fa-solid fa-users" style="font-size: 2em; margin-bottom: 16px; display: block;"></i>
                    No hay usuarios registrados aún
                </td>
            `;
            tbody.appendChild(tr);
        } else {
            // Mostrar usuarios ordenados por fecha de registro (más recientes primero)
            usuarios
                .sort((a, b) => {
                    const fechaA = new Date(a.fechaRegistro || a.fechaActualizacion || 0);
                    const fechaB = new Date(b.fechaRegistro || b.fechaActualizacion || 0);
                    return fechaB - fechaA;
                })
                .forEach((u, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${u.nombre || ''}</td>
                        <td>${u.apellido || ''}</td>
                        <td>${u.email || ''}</td>
                        <td>${u.cedula || ''}</td>
                        <td>${u.telefono || ''}</td>
                        <td>${u.genero || ''}</td>
                        <td>${u.fecha || ''}</td>
                        <td style="color: ${u.boletin ? '#388e3c' : '#666'};">${u.boletin ? 'Sí' : 'No'}</td>
                        <td>${u.nit || ''}</td>
                        <td>${u.razon || ''}</td>
                    `;
                    
                    // Destacar registros recientes
                    const fechaRegistro = new Date(u.fechaRegistro || u.fechaActualizacion);
                    const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    if (fechaRegistro > haceUnDia) {
                        tr.style.backgroundColor = '#f0f9ff';
                        tr.style.borderLeft = '3px solid #1a8cff';
                    }
                    
                    tbody.appendChild(tr);
                });
            
            // Agregar resumen al final
            const resumenTr = document.createElement('tr');
            resumenTr.style.backgroundColor = '#f3f7ff';
            resumenTr.style.fontWeight = 'bold';
            resumenTr.innerHTML = `
                <td colspan="7">Total de usuarios registrados: ${usuarios.length}</td>
                <td style="color: #388e3c;">Suscritos: ${usuarios.filter(u => u.boletin).length}</td>
                <td colspan="2">Jurídicas: ${usuarios.filter(u => u.nit || u.razon).length}</td>
            `;
            tbody.appendChild(resumenTr);
        }
    });
    
})();