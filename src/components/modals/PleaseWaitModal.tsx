

export const PleaseWaitModal = () => {
    return (
        <div  style = {{
            background: 'rgba(1, 9, 23, 0.7)',
            position: 'absolute',
            zIndex: '11',
            height: '100%', 
            width: '100%',
            alignItems: 'center',
            boxSizing: 'border-box',
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',      
                borderRadius: '2%',
                width: '300px',
                height: '150px',
                marginLeft: 'auto',
                marginRight: 'auto',
                background: 'white',
                border: 'none',
            }}>
                <h1 style={{paddingTop: '7px', textAlign: 'center'}}>We will tend to you shortly...</h1>
            </div>
        </div>
    );
};