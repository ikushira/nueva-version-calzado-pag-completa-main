// Modal Guía de Tallas - Lógica de apertura, cierre y contenido dinámico


// Inserta el modal dinámicamente al hacer click en el botón "Guía de tallas" si no existe
function ensureGuiaTallasModal() {
  if (!document.getElementById('modal-guia-tallas')) {
    const modalHtml = `
    <div id="modal-guia-tallas" class="modal-guia-tallas" style="display:none;">
      <div class="modal-gt-content">
        <button class="modal-gt-close" id="close-modal-gt" aria-label="Cerrar">&times;</button>
        <div class="modal-gt-body">
          <div class="modal-gt-img" id="modal-gt-img">
            <img src="assets/img/guiatalla1.webp" alt="Guía de tallas" id="img-gt-main" />
          </div>
          <div class="modal-gt-panel">
            <div class="modal-gt-select-bar">
              <select id="modal-gt-select">
                <option value="medida">Recomendaciones para encontrar tu talla</option>
                <option value="hombres">Hombres</option>
                <option value="mujeres">Mujeres</option>
                <option value="ninos">Niños</option>
              </select>
            </div>
            <div id="modal-gt-content-panel">
              <div id="gt-recomendaciones">
                <ul class="gt-recom-list">
                  <li>Pon una hoja de papel en el suelo.</li>
                  <li>Si vas a usar el zapato con medias, póntelas.</li>
                  <li>Ponte de pie sobre la hoja, con los talones pegados a la pared.</li>
                  <li>Marca con un lápiz hasta dónde llega el dedo más largo.</li>
                  <li>Toma la hoja y mide la distancia con una regla, desde el borde hasta la marca de lápiz.</li>
                  <li>El número que te da, son los centímetros del largo de tu pie.</li>
                  <li>Si quedas entre dos tallas, te recomendamos elegir la más grande.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    attachGuiaTallasModalEvents();
  }
}

function attachGuiaTallasModalEvents() {
  document.getElementById('close-modal-gt').onclick = function() {
    document.getElementById('modal-guia-tallas').style.display = 'none';
  };
  document.getElementById('modal-gt-select').addEventListener('change', function() {
    mostrarPanelGuiaTallas(this.value);
    cambiarImagenGuiaTallas(this.value);
  });
  document.getElementById('modal-guia-tallas').addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-guia-tallas')) {
    e.preventDefault();
    ensureGuiaTallasModal();
    document.getElementById('modal-guia-tallas').style.display = 'block';
    mostrarPanelGuiaTallas('medida');
    cambiarImagenGuiaTallas('medida');
  }
});

function mostrarPanelGuiaTallas(opcion) {
  const panel = document.getElementById('modal-gt-content-panel');
  if (opcion === 'medida') {
    panel.innerHTML = document.getElementById('gt-recomendaciones').outerHTML;
    return;
  }
  if (opcion === 'hombres') {
    panel.innerHTML = `
      <table class="gt-table">
        <thead>
          <tr><th>Talla Colombiana</th><th>Talla Brasil</th><th>Medida en Centímetros</th></tr>
        </thead>
        <tbody>
          <tr><td>37</td><td>36</td><td>25</td></tr>
          <tr><td>38</td><td>37</td><td>25.7</td></tr>
          <tr><td>39</td><td>38</td><td>26</td></tr>
          <tr><td>40</td><td>39</td><td>26.5</td></tr>
          <tr><td>41</td><td>40</td><td>27.5</td></tr>
          <tr><td>42</td><td>41</td><td>28</td></tr>
          <tr><td>43</td><td>42</td><td>28.7</td></tr>
        </tbody>
      </table>
    `;
    return;
  }
  if (opcion === 'mujeres') {
    panel.innerHTML = `
      <table class="gt-table">
        <thead>
          <tr><th>Talla Colombiana</th><th>Talla Brasil</th><th>Medida en Centímetros</th></tr>
        </thead>
        <tbody>
          <tr><td>34</td><td>33</td><td>22.5</td></tr>
          <tr><td>35</td><td>34</td><td>23</td></tr>
          <tr><td>36</td><td>35</td><td>23.5</td></tr>
          <tr><td>37</td><td>36</td><td>24</td></tr>
          <tr><td>38</td><td>37</td><td>24.5</td></tr>
          <tr><td>39</td><td>38</td><td>25</td></tr>
          <tr><td>40</td><td>39</td><td>25.5</td></tr>
          <tr><td>41</td><td>40</td><td>26</td></tr>
        </tbody>
      </table>
    `;
    return;
  }
  if (opcion === 'ninos') {
    panel.innerHTML = `
      <table class="gt-table">
        <thead>
          <tr><th>Talla Colombiana</th><th>Talla Brasil</th><th>Medida en Centímetros</th></tr>
        </thead>
        <tbody>
          <tr><td>18</td><td>17</td><td>10</td></tr>
          <tr><td>19</td><td>18</td><td>11</td></tr>
          <tr><td>20</td><td>19</td><td>11.7</td></tr>
          <tr><td>21</td><td>20</td><td>14</td></tr>
          <tr><td>22</td><td>21</td><td>14.5</td></tr>
          <tr><td>23</td><td>22</td><td>15.5</td></tr>
          <tr><td>24</td><td>23</td><td>16</td></tr>
          <tr><td>25</td><td>24</td><td>16.5</td></tr>
          <tr><td>26</td><td>25</td><td>17.5</td></tr>
          <tr><td>27</td><td>26</td><td>18</td></tr>
          <tr><td>28</td><td>27</td><td>19</td></tr>
          <tr><td>29</td><td>28</td><td>19.5</td></tr>
          <tr><td>30</td><td>29</td><td>20</td></tr>
          <tr><td>31</td><td>30</td><td>21</td></tr>
          <tr><td>32</td><td>31</td><td>21.5</td></tr>
          <tr><td>33</td><td>32</td><td>22</td></tr>
          <tr><td>34</td><td>33</td><td>22.5</td></tr>
          <tr><td>35</td><td>34</td><td>23.5</td></tr>
          <tr><td>36</td><td>35</td><td>24</td></tr>
        </tbody>
      </table>
    `;
    return;
  }
}

function cambiarImagenGuiaTallas(opcion) {
  const img = document.getElementById('img-gt-main');
  if (opcion === 'hombres' || opcion === 'mujeres') {
    img.src = 'assets/img/zapatomedida.png';
    img.alt = 'Medida zapato adulto';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    return;
  }
  if (opcion === 'ninos') {
    img.src = 'assets/img/zapatosmedidasninos.png';
    img.alt = 'Medida zapato niños';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    return;
  }
  img.src = 'assets/img/guiatalla1.webp';
  img.alt = 'Guía de tallas';
  img.style.width = '';
  img.style.height = '';
  img.style.objectFit = '';
}
