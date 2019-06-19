// import { jpgReadXmp } from '@/js/xmp-api.js'
import { jpgReadXmp } from '../../dist/lib/xmpEditor.common.js'
import pathUtil from 'path'
import { promisify } from 'util'
import { readFile } from 'fs'

describe('XMP Editor', () => {
  it('reads XMP data from a JPG file', async () => {
    const path = pathUtil.resolve(`public/data/jpg-xmp/004.jpg`)
    const buf = await promisify(readFile)(path)
    const arrBuf = new Uint8Array(buf).buffer
    const xmpStr = jpgReadXmp(arrBuf)
    expect(typeof xmpStr).toEqual('string')
    expect(xmpStr.includes('id="W5M0MpCehiHzreSzNTczkc9d"')).toBeTruthy()
  })
})
