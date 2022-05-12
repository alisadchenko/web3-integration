import React, {useState} from 'react';
import {ethers} from 'ethers';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
    const [chainId, setChainId] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
                setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
                getChainId(result[0]);
            })
            .catch(error => {
				setErrorMessage(error.message);
            });

          } else {
              setErrorMessage('Install Metamask');
          }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        getAccountBalance(newAccount.toString());
    }

    const getChainId = async (account) => {
        window.ethereum.request({ method: 'eth_chainId' })
        .then(id => {
            setChainId(parseInt(id, 16))
        })
        .catch(error => {
			setErrorMessage(error.message);
		});
    }

    const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

    const chainChangedHandler = () => {
		window.location.reload();
	}
    
    window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                Connection to MetaMask using window.ethereum methods
                </Typography>
                <CardActions>
                    <Button size="small" variant="contained" onClick={connectWalletHandler}>{connButtonText}</Button>
                </CardActions>
                <Typography variant="h6" component="div">
                    Chain: {chainId}
                </Typography>
                <Typography variant="h6" component="div">
                    Address: {defaultAccount}
                </Typography>
                <Typography variant="h6" component="div">
                    Balance: {userBalance}
                </Typography>
                <Typography variant="subtitle1" component="div">
                    {errorMessage}
                </Typography>
            </CardContent>
            
        </Card>
	);
}

export default WalletCard;