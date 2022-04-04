import Account from "../../db/models/account";
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
        const { uuid } = req.query;
        
        const account = await Account.create({
            title,
            content,
            status: 1,
            userId: user.id,
          });
        res.status(200).json({ account });
    } catch (e: any) {
        res.status(400).json({
            error_code: 'get_accounts',
            message: e.message
        });
    }
});