import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import CircularProgress from '@mui/material/CircularProgress';

const columns = [
    { id: "hash", minWidth: 100 },
    { id: "link", minWidth: 100 },
]

function useQuery() {
    return new URLSearchParams(window.location.search);
}

function TableComponent() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const query = useQuery();
    const toParam = query.get('to') || '0x9faFfeb7e7f0F46aCA2Ce6654de93c634F15da21';
    const showForm = query.get('form') === 'true';
    const [toValue, setToValue] = useState(toParam);

    const handleInputChange = (event) => {
        setToValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setTransactions([]);
        subscribeToAddress(toValue);
    };

    const subscribeToAddress = (address) => {
        const apiCall = { "jsonrpc": "2.0", "id": 1, "method": "zmk_txpool_tx_subscribe", "params": [`('to' = '${address}')`] }
        const initialQuery = { "jsonrpc": "2.0", "id": 2, "method": "zmk_txpool_query", "params": [`('to' = '${address}')`] }
        
        // XXX replace with your ZMOK endpoint
        const client = new W3CWebSocket("wss://api.zmok.io/mainnet/YOUR_APP_ID")
        // const client = new W3CWebSocket("ws://127.0.0.1:8080/ws")
        

        client.onopen = (event) => {
            client.send(JSON.stringify(initialQuery))
            client.send(JSON.stringify(apiCall))
        }

        client.onmessage = (event) => {
            const json = JSON.parse(event.data);

            if (json.result && json.result.pending) {
                const pendingTransactions = json.result.pending;
                for (let hash in pendingTransactions) {
                    if (pendingTransactions.hasOwnProperty(hash)) {
                        const newTransaction = {
                            hash: hash,
                            link: "https://etherscan.io/tx/" + hash
                        }
                        setTransactions(prevTransactions => {
                            if (prevTransactions.find(tx => tx.hash === newTransaction.hash)) {
                                console.log(`[${new Date().toISOString()}] Transaction ${newTransaction.hash} already exists.`);
                                return prevTransactions;
                            } else {
                                console.log(`[${new Date().toISOString()}] Adding transaction ${newTransaction.hash}.`);
                                return [...prevTransactions, newTransaction];
                            }
                        });
                        
                    }
                } 
                setLoading(false);               
            }

            if (json.result && json.result.removed) {
                const removedTransactions = json.result.removed;
                for (let hash in removedTransactions) {
                    if (removedTransactions.hasOwnProperty(hash)) {
                        const hashToRemove = hash;
                        setTransactions(prevTransactions => {
                            console.log(`[${new Date().toISOString()}] Removing transaction ${hashToRemove}.`);
                            return prevTransactions.filter(tx => tx.hash !== hashToRemove);
                        });
                    }
                }                
            }
        }

        return () => {
            if (client.readyState === 1) {
                client.close()
            }
        }
    }

    useEffect(() => {
        subscribeToAddress(toParam);
    }, [toParam]);

    return (
        <div>
            {loading ? <CircularProgress /> : 
            <div>
                {showForm && (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label>
                                To:
                                <input type="text" value={toValue} onChange={handleInputChange} />
                            </label>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}

                <h2>Total Transactions: {transactions.length}</h2>

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 800 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Hash</TableCell>
                                    <TableCell>Link</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.hash}>
                                        {columns.map(column => (
                                            <TableCell key={column.id}>
                                                {column.id === "link" ? <a href={row[column.id]} target="_blank" rel="noopener noreferrer">link</a> : row[column.id]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>}
        </div>
    )
}

ReactDOM.render(<TableComponent />, document.getElementById("root"))
