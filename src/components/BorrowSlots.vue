<template>
    <div class="borrowSlots">
        <h1>Borrow parking slots</h1>

        <p>These are the slots you can borrow: </p>
        <table class="list">
            <thead>
            <th>Place</th>
            <th>Start Date</th>
            <th>End Date</th>
            </thead>
            <tr v-for="decl in this.avails" v-bind:key="decl.id">
                <td>{{findSlotDescById(decl.slotId)}}</td>
                <td>{{callFormatDate(decl.startDate)}}</td>
                <td>{{callFormatDate(decl.endDate)}}</td>
                <td>
                    <b-button v-on:click="openBorrowDialog(decl)" variant="outline-primary">Borrow</b-button>
                </td>
            </tr>
        </table>

        <br/>

        <p>These are your future reservations:</p>
        <table class="list">
            <thead>
            <th>Place</th>
            <th>Start Date</th>
            <th>End Date</th>
            </thead>
            <tr v-for="loan in this.loans" v-bind:key="loan.id">
                <td>{{findSlotDescById(loan.slotId)}}</td>
                <td>{{callFormatDate(loan.startDate)}}</td>
                <td>{{callFormatDate(loan.endDate)}}</td>
                <td>
                    <b-button v-on:click="deleteLoan(loan)" variant="outline-primary"><img src="../assets/trash.svg"
                                                                                           alt="delete this loan"/>
                    </b-button>
                </td>
            </tr>
        </table>


        <!--Edit modal window -->
        <div v-if="showEdit" class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h3>Borrow a Slot</h3>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <p>Start date:
                                <datepicker v-model="loan.startDate" name="startDate" :monday-first="true"
                                            :disabledDates="disabledStartDates"></datepicker>
                            </p>
                            <p>End date:
                                <datepicker v-model="loan.endDate" name="endDate" :monday-first="true"
                                            :disabledDates="disabledEndDates"></datepicker>
                            </p>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <b-button class="modal-default-button" @click="showEdit = false">
                                Cancel
                            </b-button>
                            <b-button class="modal-default-button" @click="saveLoan">
                                Confirm
                            </b-button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    import Datepicker from 'vuejs-datepicker';
    import {formatDate, findAreaNameById, getSlotLabel} from '../common'
    import {loadAreas, loadSlots, loadAvailableFreeSlotDeclarations, loadLoans, saveLoan, deleteLoan} from '../server'

    export default {
        name: 'BorrowSlots',
        props: [
            'settings'
        ],
        data() {
            return {
                decls: null,
                //all declarations + availabilities as objects
                avails: null,
                slots: null,
                areas: null,
                showEdit: false,
                loan: null,
                loans: null,
                disabledStartDates: null,
                disabledEndDates: null
            }
        },
        components: {
            Datepicker
        },
        methods: {

            findSlotDescById: function (id) {
                if (this.slots) {
                    var mySlot = this.slots.find(
                        function (el) {
                            return el.id === id
                        }
                    );
                    if (mySlot) {
                        var areaName = findAreaNameById(this.areas, mySlot.areaId);
                        return getSlotLabel(mySlot, areaName)
                    } else {
                        return ""
                    }
                } else {
                    return ""
                }
            },
            callFormatDate: function (date) {
                return formatDate(date)
            },
            findSlotLabel: function (slot) {
                var areaName = findAreaNameById(this.areas, slot.areaId);
                return getSlotLabel(slot, areaName)
            },
            createAvailabilityId: function (decl, avail) {
                return decl.id + "_" + avail.startDate + "_" + avail.endDate
            },
            findDeclIdFromAvailability: function (avail) {
                return avail.id.substring(0, avail.id.indexOf("_"))
            },
            openBorrowDialog: function (avail) {
                //find first & last possible dates
                var possibleStartDate=Date.parse(avail.startDate)
                var now=new Date().setHours(0, 0, 0, 0)
                console.log("possibleStartDate="+possibleStartDate+", now="+now)
                if(possibleStartDate<now){
                    possibleStartDate=now
                }
                var lastDisabled = new Date(possibleStartDate)
                var firstDisabled = new Date(avail.endDate)
                this.disabledStartDates = {
                    to: lastDisabled
                }
                this.disabledEndDates = {
                    from: firstDisabled
                }

                this.loan = {
                    declId: this.findDeclIdFromAvailability(avail),
                    slotId: avail.slotId,
                    tenant: this.settings.username,
                    owner: avail.owner,
                    startDate: lastDisabled,
                    endDate: avail.endDate
                }
                this.showEdit = true
                console.log("borrowing a slot for decl=" + JSON.stringify(avail) + ", initial loan=" + JSON.stringify(this.loan))
            },
            saveLoan: function () {
                this.showEdit = false
                console.log("saving loan " + this.loan)
                saveLoan(this.settings, this.loan)
                    .then(response => {
                        this.loan.id = response.data.id
                        this.showEdit = false
                        this.loans.push(this.loan)

                        //also remove corresponding availability !
                        this.loadDeclarations()
                    })
                    .catch(function (error) {
                        console.log("error in creating loan: " + error)
                    }.bind(this))

            },
            deleteLoan: function (loan) {
                console.log("deleting loan " + loan)
                deleteLoan(this.settings, loan)
                    .then(() => {
                        this.loans.splice(this.loans.indexOf(loan), 1);
                        this.loan = null
                        //also reset corresponding availability !
                        this.loadDeclarations()
                    })
                    .catch(function (error) {
                        console.log("error in deleting loan: " + error)
                    }.bind(this))

            },
            createAvails(decls) {
                this.avails = []
                decls.forEach(decl => {
                    decl.availabilities.forEach(avail => {
                        avail.id = this.createAvailabilityId(decl, avail)
                        avail.owner = decl.owner
                        avail.slotId = decl.slotId
                        avail.preferredTenants = decl.preferredTenants
                        //leave startDate & endDate as is
                        this.avails.push(avail)
                    })
                })
                console.log("built availabilities: " + JSON.stringify(this.avails))
            },
            loadDeclarations: function () {
                loadAvailableFreeSlotDeclarations(this.settings)
                    .then(response => {
                        this.decls = response.data;
                        console.log("loaded declarations: " + this.decls)
                        this.createAvails(this.decls);
                    })
                    .catch(function (error) {
                        console.log("error in getting available free slots decls: " + error)
                    }
                        .bind(this))
            }
        },

        mounted: function () {
            //redirect if no server settings
            if (!this.settings) {
                this.$router.push('hello')
            } else {
                //load areas
                loadAreas(this.settings)
                    .then(response => {
                        this.areas = response.data;
                    })
                    .catch(function (error) {
                        console.log("error in getting areas: " + error)
                    }.bind(this))

                //load slots
                loadSlots(this.settings)
                    .then(response => {
                        this.slots = response.data;
                    })
                    .catch(function (error) {
                        console.log("error in getting slots: " + error)
                    }.bind(this))

                //load available declarations
                /*loadAvailableFreeSlotDeclarations(this.settings)
                 .then(response => {
                   this.decls=response.data;
                   this.createAvails(this.decls);
               })
                 .catch(function (error) {
                   console.log("error in getting available free slots decls: "+error)
                 }
                 .bind(this))*/
                this.loadDeclarations()

                //load loans
                loadLoans(this.settings)
                    .then(response => {
                        this.loans = response.data;
                        console.log("loaded loans: " + this.loans)
                    })
                    .catch(function (error) {
                        console.log("error in getting loans: " + error)
                    }.bind(this))

            }
        }
    }
</script>

<style src="../style.css"/>
