import { useState } from 'react';
import Logo from '../public/gov.png';
import { consultarPlaca } from "placa-fipe-api";
import './App.css';

function App() {
  const [placa, setPlaca] = useState('');
  const [carregando, setCarregando] = useState(false); // Estado para controle do modal de carregamento
  const [dadosVeiculo, setDadosVeiculo] = useState(null); // Estado para armazenar as informações do veículo
  const [exibindoValores, setExibindoValores] = useState(false); // Estado para determinar o conteúdo exibido no modal
  const [paginaPagamento, setPaginaPagamento] = useState(false); // Estado para determinar se deve mostrar a tela de pagamento

  const handleChange = (e) => {
    setPlaca(e.target.value);
  }

  const buscarPlaca = () => {
    setCarregando(true); // Ativa o modal de carregamento
    console.log('Buscando placa: ', placa); // Adicionando log de depuração

    consultarPlaca({ placa: placa })
      .then((resultado) => {
        console.log('Resultado recebido:', resultado); // Verifique o que é retornado
        setDadosVeiculo(resultado); // Armazena os dados do veículo
        setCarregando(false); // Desativa o modal de carregamento
      })
      .catch((error) => {
        console.error('Erro ao buscar a placa:', error); // Adicionando log de erro
        setCarregando(false); // Desativa o modal de carregamento
      });
  }

  const continuar = () => {
    setExibindoValores(true); // Altera o estado para exibir "Valores de quitação"
  }

  const prosseguirPagamento = () => {
    setPaginaPagamento(true); // Altera o estado para mostrar a tela de pagamento
  }

  return (
    <div className='container' style={{ width: '100vw' }}>
      <div className='primary-container'>
        <div className='navbar' style={{ margin: '15px' }}>
          <img src={Logo} alt="" style={{ width: '150px', margin: '0' }} />
        </div>
        <div className='content'>
          <h3>Benefício Desconto IPVA 2025</h3>
          <span style={{ fontWeight: '600' }}>Informe abaixo a placa<br />do seu veículo para mais informações.</span>
          <div className='forms'>
            <p>PLACA:</p>
            <input type="text" value={placa} onChange={handleChange} />
          </div>
          <span className='buttons' onClick={buscarPlaca}>BUSCAR</span>
        </div>
      </div>

      {/* Modal de Carregamento */}
      {carregando && (
        <div className="modal">
          <div className="modal-content">
            <p>Carregando...</p>
            <div className="spinner"></div> {/* Aqui você pode adicionar um ícone de carregamento */}
          </div>
        </div>
      )}

      {/* Modal com informações do veículo */}
      {!exibindoValores && dadosVeiculo && !carregando && !paginaPagamento && (
        <div className="modal">
          <div className="modal-content">
            <h4>Informações do Veículo</h4>
            <p><strong>Marca:</strong> {dadosVeiculo['Marca']}</p>
            <p><strong>Modelo:</strong> {dadosVeiculo['Modelo']}</p>
            <p><strong>Ano:</strong> {dadosVeiculo['Ano']}</p>
            <p><strong>Ano Modelo:</strong> {dadosVeiculo['Ano Modelo']}</p>
            <p><strong>UF:</strong> {dadosVeiculo['UF']}</p>
            <p><strong>Município:</strong> {dadosVeiculo['Municipio']}</p>
            <div className='btn-div'>
              <span className='buttons' onClick={continuar}>CONTINUAR</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal com o texto "Valores de quitação" */}
      {exibindoValores && !carregando && !paginaPagamento && (
        <div className="modal">
          <div className="modal-content">
            <h4>Valores de quitação</h4>
            <p style={{ marginBottom: '20px', fontWeight: '500' }}>Valores de quitação do IPVA 2025:</p>
            <p>Valor alíquota: <del style={{ color: 'red' }}>R$ {dadosVeiculo['Fipe']?.Valor ?
              (parseFloat(dadosVeiculo['Fipe']?.Valor.replace('R$', '').replace('.', '').replace(',', '.') ) * 0.02).toFixed(2)
              : 'Valor não disponível'}</del></p>
            <p>Valor com benefício: <p style={{ color: 'green', fontWeight: '600', fontSize: '20px' }}>R$ {dadosVeiculo['Fipe']?.Valor ?
              (parseFloat(dadosVeiculo['Fipe']?.Valor.replace('R$', '').replace('.', '').replace(',', '.') ) * 0.0120).toFixed(2)
              : 'Valor não disponível'}</p></p>
            <div className='btn-div'>
              <span className='buttons' onClick={prosseguirPagamento}>PROSSEGUIR</span>
            </div>
          </div>
        </div>
      )}

      {/* Tela de Pagamento */}
      {paginaPagamento && (
        <div className="modal">
          <div className="modal-content">
            <h4>Pagamento</h4>
            <p style={{fontWeight: '500'}}>Finalize o pagamento do IPVA 2025:</p>
            <p style={{ color: 'green', fontWeight: '600', fontSize: '20px' }}>R$ {dadosVeiculo['Fipe']?.Valor ?
              (parseFloat(dadosVeiculo['Fipe']?.Valor.replace('R$', '').replace('.', '').replace(',', '.') ) * 0.0120).toFixed(2)
              : 'Valor não disponível'}</p>
            <div className='btn-div'>
              <span className='buttons'>GERAR QRCODE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;
