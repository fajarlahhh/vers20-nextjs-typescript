import Contract from "../../db/models/contract";

export default async function handler(req: any, res: any) {
    try {
        const contract = await Contract.findAll();
        res.status(200).json({ contract });
    } catch (e: any) {
        res.status(400).json({
            error_code: 'get_contracts',
            message: e.message
        });
    }
}