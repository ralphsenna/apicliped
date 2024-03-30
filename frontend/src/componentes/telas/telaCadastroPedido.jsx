import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Pagina from "../templates/pagina";
import TabelaPedidos from "../tabelas/tabelaPedidos";
import FormCadPedidos from "../formularios/formCadPedidos";

const urlCliente = "http://localhost:4000/cliente";
const urlPedido = "http://localhost:4000/pedido";

export default function TelaCadastroPedido(props) 
{
    const [exibirTabela, setExibirTabela] = useState(true);
    const [listaPedidos, setListaPedidos] = useState([]);
    const [listaClientes, setListaClientes] = useState([{
        cod: "",
        nome: "Nenhuma cliente cadastrado"
    }]);
    const [atualizando, setAtualizando] = useState(false);
    const [pedidoAtual, setPedidoAtual] = useState({
        cod: 0, 
        qtdItens: null,
        valTotal: null,
        data: "",
        obs: "",
        cliente: {}
    });

    function consultarCliente()
    {
        fetch(urlCliente, {method: 'GET'})
        .then(resposta => resposta.json())
        .then(retorno => {
            if (retorno.status)
            {
                setListaClientes(retorno.listaClientes);
            }
            else
            {
                alert(retorno.mensagem);
            }
        })
        .catch(erro => {
            setListaClientes([{
                cod: 0,
                nome: "Erro ao recuperar clientes: " + erro.message
            }]);
        });
    }
    useEffect(() => {
        if (!exibirTabela)
            consultarCliente();
    }, [exibirTabela]);

    function consultarPedidos() 
    {
        fetch(urlPedido, {method: 'GET'})
        .then(resposta => resposta.json())
        .then(retorno => {
            if (retorno.status) 
            {
                setListaPedidos(retorno.listaPedidos);
                for (let i=0; i<retorno.listaPedidos.length; i++)
                {
                    retorno.listaPedidos[i].data = retorno.listaPedidos[i].data.split("T")[0];
                }
            }
            else 
            {
                alert(retorno.mensagem);
            }
        })
        .catch(erro => {
            alert("Erro: " + erro.message);
        });
    }
    useEffect(() => {
        if (exibirTabela)
            consultarPedidos();
    }, [exibirTabela]);

    function gravarPedido(pedido)
    {
        if (!atualizando)
        {
            fetch(urlPedido, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(pedido)
            })
            .then(resposta => resposta.json())
            .then(retorno => {
                if (retorno.status)
                {
                    alert(retorno.mensagem + " Código do pedido: " + retorno.codigoGerado);
                    setExibirTabela(true);
                }
                else
                {
                    alert(retorno.mensagem);
                }
            })
            .catch(erro => {
                alert("Erro: " + erro.message);
            });
        }
        else
        {
            fetch(urlPedido, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(pedido)
            })
            .then(resposta => resposta.json())
            .then(retorno => {
                if (retorno.status)
                {
                    alert(retorno.mensagem);
                    setExibirTabela(true);
                }
                else
                {
                    alert(retorno.mensagem);
                }
            })
            .catch(erro => {
                alert("Erro: " + erro.message);
            });
        }
    }

    function atualizarPedido(pedido)
    {
        setExibirTabela(false);
        setAtualizando(true);
        setPedidoAtual(pedido);
    }

    function excluirPedido(pedido)
    {
        fetch(urlPedido, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({cod: pedido.cod})
        })
        .then(resposta => resposta.json())
        .then(retorno => {
            if (retorno.status)
            {
                alert(retorno.mensagem);
                
                consultarPedidos();
            }
            else
            {
                alert(retorno.mensagem);
            }
        })
        .catch(erro => {
            alert("Erro: " + erro.message);
        });
    }

    if (exibirTabela) 
    {
        return (
            <div>
                <Pagina>
                    <h1>Tela de Cadastro de Pedidos</h1>
                    <br/>
                    <h2>Lista de Pedidos</h2>
                    <Button onClick={() => {
                            setExibirTabela(false);
                        }}>
                        Cadastrar Novo Pedido
                    </Button>
                    <TabelaPedidos listaPedidos={listaPedidos} atualizarPedido={atualizarPedido} excluirPedido={excluirPedido} setExibirTabela={setExibirTabela}/>
                </Pagina>
            </div>
        )
    }
    else 
    {
        return (
            <div>
                <Pagina>
                    <h1>Tela de Cadastro de Pedidos</h1>
                    <br/>
                    <h2>Formulário de cadastro de Pedidos</h2>
                    <FormCadPedidos 
                        exibirTabela={exibirTabela}
                        setExibirTabela={setExibirTabela}
                        listaClientes={listaClientes}
                        gravarPedido={gravarPedido}
                        atualizando={atualizando}
                        setAtualizando={setAtualizando}
                        pedido={pedidoAtual}
                        setPedidoAtual={setPedidoAtual}
                    />
                </Pagina>
            </div>
        )
    }
}
