import Account from "../../db/models/accounts";
import nextConnect from 'next-connect';

export default nextConnect()
.get(async (req: any, res: any)=> {
    try {
        const { uuid } = req.query;
        
        let account;
        if (req) {
            account = await Account.findOne({ where: { uuid: uuid } })
        } else {
            account = await Account.findAll();
        }
        res.status(200).json({ account });
    } catch (e: any) {
        res.status(400).json({
            error_code: 'get_accounts',
            message: e.message
        });
    }
})
.post(async (req: any, res: any)=> {
    try {
        const { uuid, username, email, password, idContract, idParent, walletAddress } = req.query;
        
        const account = await Account.create({
            uuid: uuid,
            username: username,
            email: email,
            password: password,
            idContract: idContract,
            idParent: idParent,
            walletAddress: walletAddress,
            emailVerification: 0
          });
        res.status(200).json({ account });
    } catch (e: any) {
        res.status(400).json({
            error_code: 'get_accounts',
            message: e.message
        });
    }
});