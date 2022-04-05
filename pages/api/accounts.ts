import Account from "../../db/models/accounts";
import nextConnect from 'next-connect';

export default nextConnect()
.get(async (req: any, res: any)=> {
    try {
        const { uuid, username } = req.query;
        
        let account;
        if (req) {
            account = await Account.findOne({ where: { 
                uuid: uuid
            } })
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
        const [account, created] = await Account.findOrCreate({
            where: { username: req.body.username },
            defaults: req.body, 
            paranoid: false
          });
        if (created) {
            res.status(200).json({ account });
        } else {
            res.status(200).json({
                error_code: 'get_accounts',
                message: "The username already exists"
            });
        }
    } catch (e: any) {
        res.status(400).json({
            error_code: 'find_or_create_account',
            message: e.message
        });
    }
})
.patch(async (req: any, res: any)=> {
    try {
        const account = await Account.update(req.body, {
            where: { id: req.body.id }
        });
        res.status(200).json({ account });
    } catch (e: any) {
        res.status(400).json({
            error_code: 'update_account',
            message: e.message
        });
    }
});